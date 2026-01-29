const dbConnection = require('../../../database/connection')
const config = require('../../../config')
const logger = require('../../../utils/logger')

/**
 * Pricing Calculator
 * Двухуровневая система расчета: instant (эвристика) и accurate (слайсинг)
 */
class PricingCalculator {
  /**
   * Calculate instant estimate (эвристика, < 1 сек)
   */
  async calculateInstant({ modelId, materialId, profileId, quantity = 1, params = {} }) {
    const db = dbConnection.getDb()

    // Get model data
    const model = db.prepare('SELECT * FROM models WHERE id = ?').get(modelId)
    if (!model) {
      throw { statusCode: 404, message: 'Model not found' }
    }

    // Get material
    const material = db.prepare('SELECT * FROM materials WHERE id = ?').get(materialId)
    if (!material) {
      throw { statusCode: 404, message: 'Material not found' }
    }

    // Get profile
    const profile = db.prepare('SELECT * FROM print_profiles WHERE id = ?').get(profileId)
    if (!profile) {
      throw { statusCode: 404, message: 'Profile not found' }
    }

    // Get pricing rules
    const pricingRules = db.prepare('SELECT * FROM pricing_rules ORDER BY id DESC LIMIT 1').get()
    if (!pricingRules) {
      throw { statusCode: 500, message: 'Pricing rules not configured' }
    }

    // Get default printer (or use first available)
    const printer = db.prepare("SELECT * FROM printers WHERE status = 'available' ORDER BY id LIMIT 1").get()
    const printerRatePerHour = printer ? printer.price_per_hour : config.pricingDefaults.printerRatePerHour

    // === STEP 1: Material Cost ===
    const volumeCm3 = model.volume / 1000 // mm³ → cm³
    const density = material.density // g/cm³

    // Infill multiplier
    const infillPercent = params.infill !== undefined ? params.infill : profile.infill_default
    const infillMultiplier = infillPercent / 100

    // Shells multiplier (примерно 10% на стенки)
    const shellsMultiplier = 1.1

    // Supports multiplier
    const supportsMultiplier = params.supports ? 1.15 : 1.0

    // Calculate weight
    const solidWeightG = volumeCm3 * density
    const estimatedWeightG = solidWeightG * infillMultiplier * shellsMultiplier * supportsMultiplier

    // Material cost
    const materialCost = estimatedWeightG * material.price_per_gram

    // === STEP 2: Print Time ===
    const heightMm = model.bbox_z
    const layerHeight = profile.layer_height
    const layerCount = Math.ceil(heightMm / layerHeight)

    // Approximate time per layer (based on surface area and speed)
    const avgLayerAreaMm2 = model.surface_area / layerCount
    const printSpeedMmPerSec = profile.speed_default || 50
    const nozzleWidth = 0.4
    const efficiency = 0.7

    const timePerLayerSec = avgLayerAreaMm2 / (printSpeedMmPerSec * nozzleWidth * efficiency)
    const basePrintTimeSec = layerCount * timePerLayerSec

    // Quality multiplier
    const qualityMultiplier = profile.time_multiplier || 1.0
    const estimatedPrintTimeSec = basePrintTimeSec * qualityMultiplier
    const printTimeHours = estimatedPrintTimeSec / 3600

    // === STEP 3: Machine Time Cost ===
    const machineTimeCost = printTimeHours * printerRatePerHour

    // === STEP 4: Labor Cost ===
    const laborFixed = pricingRules.labor_fixed || 0
    const laborRatePerHour = pricingRules.labor_rate_per_hour || 0
    const laborFromTime = printTimeHours * laborRatePerHour
    const laborCost = laborFixed + laborFromTime

    // === STEP 5: Postprocessing ===
    const postprocessOption = params.postprocess || 'none'
    const postprocessOptions = pricingRules.postprocess_options_json
      ? JSON.parse(pricingRules.postprocess_options_json)
      : []
    const postprocessData = postprocessOptions.find((opt) => opt.name === postprocessOption) || {
      price: 0,
      days: 0,
    }
    const postprocessCost = postprocessData.price

    // === STEP 6: Subtotal before margin ===
    const setupFee = pricingRules.setup_fee || 0
    const subtotalBeforeMargin = materialCost + machineTimeCost + laborCost + postprocessCost + setupFee

    // === STEP 7: Margin ===
    const marginPercent = pricingRules.margin_percent || 20
    const marginCost = subtotalBeforeMargin * (marginPercent / 100)
    const subtotal = subtotalBeforeMargin + marginCost

    // === STEP 8: Min Price ===
    const minOrderPrice = pricingRules.min_order_price || 500
    let pricePerUnit = Math.max(subtotal, minOrderPrice)

    // === STEP 9: Bulk Discount ===
    const bulkDiscountRules = pricingRules.bulk_discount_rules_json ? JSON.parse(pricingRules.bulk_discount_rules_json) : []
    let discountPercent = 0
    for (const rule of bulkDiscountRules.sort((a, b) => b.qty_from - a.qty_from)) {
      if (quantity >= rule.qty_from) {
        discountPercent = rule.discount_percent
        break
      }
    }

    const totalBeforeDiscount = pricePerUnit * quantity
    const discountAmount = totalBeforeDiscount * (discountPercent / 100)
    const totalAfterDiscount = totalBeforeDiscount - discountAmount

    // === STEP 10: Production Days ===
    const productionDays = Math.ceil(printTimeHours / 8) // 8 часов работы принтера в день
    const queueBufferDays = 1 // буфер очереди
    const postprocessDays = postprocessData.days || 0
    const totalProductionDays = productionDays + queueBufferDays + postprocessDays

    const estimatedDaysMin = Math.max(1, totalProductionDays - 1)
    const estimatedDaysMax = totalProductionDays + 2

    // === Warnings ===
    const warnings = model.warnings_json ? JSON.parse(model.warnings_json) : []
    if (params.supports && !warnings.includes('Модель требует supports')) {
      warnings.push('Добавлены supports (+15% материала)')
    }

    // === Result ===
    return {
      price: totalAfterDiscount,
      price_per_unit: pricePerUnit,
      quantity,
      discount_percent: discountPercent,
      discount_amount: discountAmount,
      estimated_days: `${estimatedDaysMin}-${estimatedDaysMax} дней`,
      breakdown: {
        material: materialCost,
        machine_time: machineTimeCost,
        labor: laborCost,
        postprocess: postprocessCost,
        setup_fee: setupFee,
        margin: marginCost,
        subtotal: pricePerUnit,
      },
      details: {
        weight_grams: Math.round(estimatedWeightG),
        print_time_hours: parseFloat(printTimeHours.toFixed(2)),
        print_time_formatted: this.formatTime(estimatedPrintTimeSec),
        layer_count: layerCount,
        volume_cm3: parseFloat(volumeCm3.toFixed(2)),
        infill_percent: infillPercent,
      },
      warnings,
      confidence: 'approximate',
    }
  }

  /**
   * Format time (seconds → human readable)
   */
  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}ч ${minutes}мин`
  }
}

module.exports = new PricingCalculator()
