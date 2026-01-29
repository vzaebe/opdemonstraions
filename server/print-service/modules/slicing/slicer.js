/**
 * CuraEngine Slicer Integration
 * Handles slicing jobs, profiles, and result parsing
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const logger = require('../../utils/logger')

class Slicer {
  constructor() {
    this.curaEnginePath = process.env.CURA_ENGINE_PATH || 'CuraEngine'
    this.profilesDir = path.join(__dirname, 'profiles')
    this.cacheDir = path.join(__dirname, '../../var/slicing-cache')
    this.maxParallelJobs = parseInt(process.env.SLICER_MAX_JOBS || '2', 10)
    this.currentJobs = 0

    // Ensure cache directory exists
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true })
    }
  }

  /**
   * Slice a model and return print time and material estimates
   * @param {Object} params - Slicing parameters
   * @returns {Promise<Object>} Slicing result
   */
  async slice(params) {
    const { modelPath, profileId, materialId, infill = 20, supports = false } = params

    // Generate cache key
    const cacheKey = this.generateCacheKey(params)
    
    // Check cache first
    const cached = await this.getCached(cacheKey)
    if (cached) {
      logger.info('Slicing result from cache', { cacheKey })
      return cached
    }

    // Wait if too many jobs
    await this.waitForSlot()

    try {
      this.currentJobs++
      const result = await this.executeSlicing(params)
      
      // Cache result
      await this.cacheResult(cacheKey, result)
      
      return result
    } finally {
      this.currentJobs--
    }
  }

  /**
   * Execute CuraEngine slicing
   * @param {Object} params - Slicing parameters
   * @returns {Promise<Object>}
   */
  async executeSlicing(params) {
    const { modelPath, profileId, materialId, infill, supports } = params

    // Load profile
    const profile = await this.loadProfile(profileId)
    
    // Create temporary definition file
    const definitionPath = await this.createDefinition(profile, {
      infill,
      supports,
      materialId,
    })

    // Output gcode path
    const outputPath = path.join(this.cacheDir, `${Date.now()}_output.gcode`)

    return new Promise((resolve, reject) => {
      const args = [
        'slice',
        '-j', definitionPath,
        '-l', modelPath,
        '-o', outputPath,
      ]

      logger.info('Starting CuraEngine', { args })

      const process = spawn(this.curaEnginePath, args)
      let stdout = ''
      let stderr = ''

      process.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      process.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      const timeout = setTimeout(() => {
        process.kill()
        reject(new Error('Slicing timeout (60s)'))
      }, 60000)

      process.on('close', async (code) => {
        clearTimeout(timeout)

        if (code !== 0) {
          logger.error('CuraEngine failed', { code, stderr })
          return reject(new Error(`Slicing failed: ${stderr}`))
        }

        try {
          // Parse gcode result
          const result = await this.parseGcode(outputPath)
          
          // Clean up temp files
          fs.unlinkSync(definitionPath)
          fs.unlinkSync(outputPath)

          logger.info('Slicing complete', result)
          resolve(result)
        } catch (err) {
          reject(err)
        }
      })

      process.on('error', (err) => {
        clearTimeout(timeout)
        logger.error('CuraEngine spawn error', err)
        reject(err)
      })
    })
  }

  /**
   * Parse gcode file to extract print time and material usage
   * @param {string} gcodePath - Path to gcode file
   * @returns {Promise<Object>}
   */
  async parseGcode(gcodePath) {
    const gcode = fs.readFileSync(gcodePath, 'utf8')
    
    let printTime = 0 // seconds
    let filamentLength = 0 // mm
    let filamentWeight = 0 // grams
    let layerCount = 0

    // Parse CuraEngine comments (format varies by version)
    const timeMatch = gcode.match(/;TIME:(\d+)/)
    if (timeMatch) {
      printTime = parseInt(timeMatch[1], 10)
    }

    const filamentMatch = gcode.match(/;Filament used: ([\d.]+)m/)
    if (filamentMatch) {
      filamentLength = parseFloat(filamentMatch[1]) * 1000 // convert to mm
    }

    const weightMatch = gcode.match(/;Filament weight: ([\d.]+)g/)
    if (weightMatch) {
      filamentWeight = parseFloat(weightMatch[1])
    }

    // Count layers
    const layerMatches = gcode.match(/;LAYER:\d+/g)
    if (layerMatches) {
      layerCount = layerMatches.length
    }

    // If weight not found, estimate from length (assuming 1.75mm PLA filament)
    if (!filamentWeight && filamentLength > 0) {
      // Volume = PI * (diameter/2)^2 * length
      // Weight = Volume * density
      const diameter = 1.75 // mm
      const density = 1.24 // g/cm³ for PLA
      const volumeCm3 = Math.PI * Math.pow(diameter / 2, 2) * filamentLength / 1000
      filamentWeight = volumeCm3 * density
    }

    // Fallback: if no time found, estimate from layer count
    if (printTime === 0 && layerCount > 0) {
      // Very rough estimate: 30-60s per layer
      printTime = layerCount * 45
    }

    return {
      printTime, // seconds
      printTimeHours: (printTime / 3600).toFixed(2),
      filamentLength, // mm
      filamentWeight, // grams
      layerCount,
      estimatedCost: null, // Will be calculated by pricing module
    }
  }

  /**
   * Load slicing profile
   * @param {number} profileId - Profile ID
   * @returns {Promise<Object>}
   */
  async loadProfile(profileId) {
    // In production, load from database
    // For now, return default profiles
    const profiles = {
      1: { name: 'Draft', layerHeight: 0.3, speed: 80 },
      2: { name: 'Standard', layerHeight: 0.2, speed: 60 },
      3: { name: 'Fine', layerHeight: 0.1, speed: 40 },
    }

    return profiles[profileId] || profiles[2]
  }

  /**
   * Create CuraEngine definition file
   * @param {Object} profile - Print profile
   * @param {Object} overrides - Parameter overrides
   * @returns {Promise<string>} Path to definition file
   */
  async createDefinition(profile, overrides) {
    const definition = {
      version: 2,
      name: 'Custom',
      settings: {
        layer_height: { default_value: profile.layerHeight },
        infill_sparse_density: { default_value: overrides.infill },
        support_enable: { default_value: overrides.supports },
        speed_print: { default_value: profile.speed },
        material_print_temperature: { default_value: 210 },
        material_bed_temperature: { default_value: 60 },
      },
    }

    const defPath = path.join(this.cacheDir, `def_${Date.now()}.def.json`)
    fs.writeFileSync(defPath, JSON.stringify(definition, null, 2))
    
    return defPath
  }

  /**
   * Generate cache key for slicing parameters
   * @param {Object} params
   * @returns {string}
   */
  generateCacheKey(params) {
    const str = JSON.stringify({
      model: params.modelHash || path.basename(params.modelPath),
      profile: params.profileId,
      material: params.materialId,
      infill: params.infill,
      supports: params.supports,
    })
    return crypto.createHash('sha256').update(str).digest('hex')
  }

  /**
   * Get cached result
   * @param {string} key
   * @returns {Promise<Object|null>}
   */
  async getCached(key) {
    const cachePath = path.join(this.cacheDir, `${key}.json`)
    if (fs.existsSync(cachePath)) {
      try {
        const data = fs.readFileSync(cachePath, 'utf8')
        return JSON.parse(data)
      } catch (err) {
        logger.warn('Cache read error', err)
        return null
      }
    }
    return null
  }

  /**
   * Cache slicing result
   * @param {string} key
   * @param {Object} result
   */
  async cacheResult(key, result) {
    const cachePath = path.join(this.cacheDir, `${key}.json`)
    try {
      fs.writeFileSync(cachePath, JSON.stringify(result))
    } catch (err) {
      logger.warn('Cache write error', err)
    }
  }

  /**
   * Wait for available slicing slot
   */
  async waitForSlot() {
    while (this.currentJobs >= this.maxParallelJobs) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  /**
   * Check if CuraEngine is available
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    return new Promise((resolve) => {
      const process = spawn(this.curaEnginePath, ['--version'])
      process.on('close', (code) => {
        resolve(code === 0)
      })
      process.on('error', () => {
        resolve(false)
      })
    })
  }
}

module.exports = new Slicer()
