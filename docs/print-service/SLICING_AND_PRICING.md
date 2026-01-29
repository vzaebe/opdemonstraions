# План слайсинга и расчета стоимости

## 1. Двухуровневая система оценки

### 1.1 Обзор стратегии

```
┌─────────────────────────────────────────────────────────────┐
│                    User Uploads Model                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│           LEVEL 1: Instant Estimate (< 1 sec)               │
│  • Эвристика на основе volume/height/area                   │
│  • Коэффициенты из БД (material, profile, printer)          │
│  • Показывает "≈" (приблизительная оценка)                  │
│  • UX: мгновенный отклик, пользователь видит цену сразу     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ├──► User видит: "₽1,250 ≈ | 12 ч ≈ | 3-5 дней"
                      │
                      └──► [Optional Button: "Получить точный расчет"]
                            (если feature flag 'slicing' = true)
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│          LEVEL 2: Accurate Estimate (5-60 sec)              │
│  • Запуск CuraEngine/PrusaSlicer в фоне                     │
│  • Реальный gcode analysis → точное время/филамент          │
│  • Кеширование результатов                                   │
│  • UX: Skeleton loader → "Уточнено: ₽1,300 | 12.5 ч | 3-5" │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Level 1: Instant Estimate (Эвристика)

### 2.1 Формула расчета

#### Шаг 1: Вес материала

```javascript
// Парсинг модели → volume (mm³)
const volumeCm3 = volumeMm3 / 1000

// Получаем плотность материала из БД (например, PLA = 1.24 g/cm³)
const materialDensity = material.density // g/cm³

// Базовый вес (solid fill)
const solidWeightG = volumeCm3 * materialDensity

// Коэффициенты заполнения
const infillPercent = params.infill || profile.infill_default // 20%
const shellsMultiplier = 1.1 // примерно 10% на стенки (shells)
const supportsMultiplier = params.supports ? 1.15 : 1.0 // +15% если supports

// Итоговый вес
const estimatedWeightG = solidWeightG * (infillPercent / 100) * shellsMultiplier * supportsMultiplier

// Стоимость материала
const materialCost = estimatedWeightG * material.price_per_gram
```

**TODO: уточнить у владельца бизнеса:**
- Точные коэффициенты для supports (зависит от сложности модели)
- Учет raft/brim (базовый слой)?

---

#### Шаг 2: Время печати

```javascript
// Высота модели
const heightMm = bbox.z

// Слой (layer height) из профиля качества
const layerHeight = profile.layer_height // например, 0.2 mm

// Количество слоев
const layerCount = Math.ceil(heightMm / layerHeight)

// Время на слой (эвристика на основе объема слоя)
const avgLayerAreaMm2 = surfaceArea / layerCount // грубая оценка
const printSpeedMmPerSec = profile.speed_default || 50 // mm/s

// Время на слой (секунды)
// Формула: area / (speed * nozzle_width * efficiency)
const nozzleWidth = 0.4 // mm (из принтера или профиля)
const efficiency = 0.7 // коэффициент эффективности (не 100% времени экструзия)
const timePerLayerSec = (avgLayerAreaMm2 / (printSpeedMmPerSec * nozzleWidth * efficiency))

// Общее время
const basePrintTimeSec = layerCount * timePerLayerSec

// Множитель качества (из профиля)
const qualityMultiplier = profile.time_multiplier || 1.0

// Итоговое время
const estimatedPrintTimeSec = basePrintTimeSec * qualityMultiplier

// Форматирование
const printTimeHours = estimatedPrintTimeSec / 3600
```

**TODO: уточнить у владельца бизнеса:**
- Средняя скорость печати для разных материалов
- Коэффициенты времени для разных профилей качества

---

#### Шаг 3: Стоимость машинного времени

```javascript
// Тариф принтера (из БД или дефолтный)
const printerRatePerHour = printer?.price_per_hour || 50 // руб/час (TODO)

// Стоимость печати
const machineTimeCost = printTimeHours * printerRatePerHour
```

---

#### Шаг 4: Трудозатраты

```javascript
// Setup fee (фиксированная стоимость на деталь или на заказ)
const setupFee = pricingRules.setup_fee || 0 // руб (TODO)

// Труд (фиксированный + процент от машинного времени)
const laborFixed = pricingRules.labor_fixed || 50 // руб (TODO)
const laborRatePerHour = pricingRules.labor_rate_per_hour || 0
const laborFromTime = printTimeHours * laborRatePerHour

const laborCost = laborFixed + laborFromTime
```

---

#### Шаг 5: Постобработка

```javascript
// Опции постобработки из params
const postprocessOption = params.postprocess || 'none'

// Получаем стоимость из pricingRules.postprocess_options_json
const postprocessData = pricingRules.postprocess_options.find(
  opt => opt.name === postprocessOption
)
const postprocessCost = postprocessData?.price || 0
const postprocessDays = postprocessData?.days || 0
```

**TODO: уточнить у владельца бизнеса:**
- Варианты постобработки (шлифовка, покраска, сборка и т.д.) и их стоимость

---

#### Шаг 6: Маржа

```javascript
// Маржа (процент от subtotal)
const marginPercent = pricingRules.margin_percent || 15 // % (TODO)

const subtotalBeforeMargin = materialCost + machineTimeCost + laborCost + postprocessCost
const marginCost = subtotalBeforeMargin * (marginPercent / 100)

const subtotal = subtotalBeforeMargin + marginCost
```

---

#### Шаг 7: Минимальная цена

```javascript
// Минимальная цена заказа (из pricingRules)
const minOrderPrice = pricingRules.min_order_price || 500 // руб (TODO)

const finalPrice = Math.max(subtotal, minOrderPrice)
```

---

#### Шаг 8: Bulk discounts (для qty > 1)

```javascript
const quantity = params.quantity || 1

// Получаем bulk discount rules из БД
const bulkRules = pricingRules.bulk_discount_rules || []
// Пример: [{ qty_from: 10, discount_percent: 5 }, { qty_from: 50, discount_percent: 10 }]

let discountPercent = 0
for (const rule of bulkRules.sort((a, b) => b.qty_from - a.qty_from)) {
  if (quantity >= rule.qty_from) {
    discountPercent = rule.discount_percent
    break
  }
}

const pricePerUnit = finalPrice
const totalBeforeDiscount = pricePerUnit * quantity
const discountAmount = totalBeforeDiscount * (discountPercent / 100)
const totalAfterDiscount = totalBeforeDiscount - discountAmount
```

**TODO: уточнить у владельца бизнеса:**
- Правила bulk discounts (количество → скидка)

---

#### Шаг 9: Сроки

```javascript
// Базовое время производства (из printTimeHours)
const productionDays = Math.ceil(printTimeHours / 8) // 8 часов работы принтера в день (TODO)

// Буфер очереди (из конфига или расчета загрузки очереди)
const queueBufferDays = 1 // TODO: динамический расчет на основе очереди

// Постобработка
const postprocessDaysTotal = postprocessDays

// Итоговые сроки
const totalProductionDays = productionDays + queueBufferDays + postprocessDaysTotal

// Диапазон (добавляем +/-1 день для вариабельности)
const estimatedDaysMin = Math.max(1, totalProductionDays - 1)
const estimatedDaysMax = totalProductionDays + 2

const estimatedDaysFormatted = `${estimatedDaysMin}-${estimatedDaysMax} дней`
```

**TODO: уточнить у владельца бизнеса:**
- Среднее время работы принтеров в день (8 ч? 12 ч? 24/7?)
- Буфер очереди (статичный или динамический на основе загрузки?)

---

### 2.2 Итоговая структура Instant Estimate Response

```json
{
  "quote_id": 123,
  "instant_estimate": {
    "price": 1250.50,
    "estimated_days": "3-5 дней",
    "breakdown": {
      "material": 450.00,
      "machine_time": 600.00,
      "labor": 100.00,
      "postprocess": 0,
      "margin": 100.50,
      "subtotal": 1250.50
    },
    "details": {
      "weight_grams": 9000,
      "print_time_hours": 12,
      "print_time_formatted": "12 ч 00 мин",
      "layer_count": 250,
      "volume_cm3": 125
    },
    "warnings": [
      "Модель требует supports (добавлено +15% материала)",
      "Тонкие стенки могут повлиять на прочность"
    ],
    "confidence": "approximate"
  },
  "accurate_available": true
}
```

---

## 3. Level 2: Accurate Estimate (Slicing)

### 3.1 Выбор слайсера

**Выбор: CuraEngine (CLI)**

**Обоснование:**
- **Open-source**: Ultimaker Cura, MIT/LGPL лицензия
- **CLI interface**: легко интегрировать через child_process
- **JSON output**: можно настроить вывод в JSON (или парсить gcode комментарии)
- **Профили**: поддержка JSON-профилей (материал, принтер, качество)
- **Performance**: быстрее PrusaSlicer для batch операций

**Альтернатива: PrusaSlicer CLI**
- Тоже open-source (AGPLv3)
- Отличная документация
- Можно использовать оба (адаптер pattern)

**Установка CuraEngine:**
```bash
# Dockerfile или VPS
RUN apt-get install -y cura-engine
# Или компиляция из исходников
```

---

### 3.2 Архитектура Slicing Module

```
┌─────────────────────────────────────────────────────────────┐
│                    Slicing Module                            │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Slicing API Controller                         │ │
│  │  POST /api/v1/slicing/estimate                         │ │
│  │  GET  /api/v1/slicing/jobs/:id                         │ │
│  └───────────────────┬────────────────────────────────────┘ │
│                      │                                       │
│                      ▼                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Slicing Service                                │ │
│  │  • createSlicingJob(model, profile, params)            │ │
│  │  • getJob(jobId)                                       │ │
│  │  • checkCache(paramsHash)                              │ │
│  └───────────────────┬────────────────────────────────────┘ │
│                      │                                       │
│                      ▼                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Job Queue (in-memory или Redis)                │ │
│  │  • Priority queue (приоритет, FIFO)                    │ │
│  │  • Max concurrency (2-4 workers параллельно)           │ │
│  │  • Job status: pending → running → completed/failed    │ │
│  └───────────────────┬────────────────────────────────────┘ │
│                      │                                       │
│                      ▼                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Worker Pool (child_process)                    │ │
│  │  • Spawn CuraEngine процессы                           │ │
│  │  • Timeout (60 sec для безопасности)                   │ │
│  │  • Resource limits (CPU/memory)                        │ │
│  │  • Cleanup temp files                                  │ │
│  └───────────────────┬────────────────────────────────────┘ │
│                      │                                       │
│                      ▼                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         CuraEngine / PrusaSlicer CLI                   │ │
│  │  Input:  STL file, JSON profile                        │ │
│  │  Output: gcode file + stdout/stderr                    │ │
│  └───────────────────┬────────────────────────────────────┘ │
│                      │                                       │
│                      ▼                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Result Parser                                  │ │
│  │  • Парсинг gcode (;TIME:, ;Filament used:, и т.д.)    │ │
│  │  • Extraction warnings                                 │ │
│  │  • Calculation cost (на основе точного времени/филамента)│ │
│  └───────────────────┬────────────────────────────────────┘ │
│                      │                                       │
│                      ▼                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Cache (DB or Redis)                            │ │
│  │  Key: SHA256(model_hash + profile + params)            │ │
│  │  Value: { time_sec, filament_g, warnings, ... }        │ │
│  │  TTL: 30 дней (или бесконечно для неизменяемых данных) │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.3 Профили слайсера

#### Структура профиля (JSON)

```json
{
  "profile_id": 2,
  "profile_name": "Standard PLA",
  "cura_settings": {
    "layer_height": 0.2,
    "wall_thickness": 0.8,
    "top_bottom_thickness": 0.8,
    "infill_sparse_density": 20,
    "infill_pattern": "grid",
    "speed_print": 50,
    "speed_travel": 150,
    "support_enable": true,
    "support_type": "buildplate",
    "adhesion_type": "brim",
    "material_print_temperature": 200,
    "material_bed_temperature": 60,
    "retraction_enable": true,
    "retraction_distance": 5
  }
}
```

**Хранение профилей:**
- Файлы профилей в `server/slicing/profiles/*.json`
- Ссылка на файл в таблице `print_profiles.slicer_profile_path`

**TODO: уточнить у владельца бизнеса:**
- Настройки профилей для разных материалов (температура, скорость, ретракт)
- Профили принтеров (если несколько принтеров с разными характеристиками)

---

### 3.4 Запуск CuraEngine

```javascript
// server/modules/slicing/worker.js

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

async function runCuraEngine(options) {
  const {
    modelPath,
    profilePath,
    outputGcodePath,
    timeout = 60000 // 60 sec
  } = options

  return new Promise((resolve, reject) => {
    const args = [
      'slice',
      '-j', profilePath,
      '-o', outputGcodePath,
      '-l', modelPath
    ]

    const cura = spawn('CuraEngine', args, {
      timeout,
      maxBuffer: 10 * 1024 * 1024 // 10 MB stdout buffer
    })

    let stdout = ''
    let stderr = ''

    cura.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    cura.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    cura.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, gcodeFile: outputGcodePath })
      } else {
        reject(new Error(`CuraEngine exited with code ${code}: ${stderr}`))
      }
    })

    cura.on('error', (err) => {
      reject(err)
    })
  })
}
```

---

### 3.5 Парсинг gcode результатов

```javascript
// server/modules/slicing/parser.js

function parseGcode(gcodeFilePath) {
  const gcode = fs.readFileSync(gcodeFilePath, 'utf-8')
  
  const result = {
    print_time_sec: null,
    filament_mm: null,
    filament_g: null,
    layer_count: null,
    warnings: []
  }

  // Парсинг комментариев CuraEngine
  // Примеры:
  // ;TIME:43200
  // ;Filament used: 9.5m
  // ;Layer count: 250
  
  const timeMatch = gcode.match(/;TIME:(\d+)/)
  if (timeMatch) {
    result.print_time_sec = parseInt(timeMatch[1], 10)
  }

  const filamentMatch = gcode.match(/;Filament used: ([\d.]+)m/)
  if (filamentMatch) {
    result.filament_mm = parseFloat(filamentMatch[1]) * 1000 // m → mm
  }

  const layerMatch = gcode.match(/;Layer count: (\d+)/)
  if (layerMatch) {
    result.layer_count = parseInt(layerMatch[1], 10)
  }

  // Расчет веса филамента
  if (result.filament_mm) {
    // Формула: weight = length × π × (diameter/2)² × density
    const filamentDiameter = 1.75 // mm (стандарт FDM)
    const filamentVolumeMm3 = result.filament_mm * Math.PI * Math.pow(filamentDiameter / 2, 2)
    const filamentVolumeCm3 = filamentVolumeMm3 / 1000
    const materialDensity = 1.24 // g/cm³ (PLA, получить из БД)
    result.filament_g = filamentVolumeCm3 * materialDensity
  }

  // Детектор warnings из gcode
  // Например, если есть комментарий ";WARNING: ..."
  const warningMatches = gcode.matchAll(/;WARNING: (.+)/g)
  for (const match of warningMatches) {
    result.warnings.push(match[1])
  }

  return result
}
```

---

### 3.6 Кеширование результатов

```javascript
// server/modules/slicing/cache.js

const crypto = require('crypto')

function generateCacheKey(modelId, profileId, params) {
  // Хеш всех параметров, влияющих на слайсинг
  const data = JSON.stringify({
    model_id: modelId,
    profile_id: profileId,
    infill: params.infill,
    supports: params.supports,
    shells: params.shells,
    // ...другие параметры
  })
  return crypto.createHash('sha256').update(data).digest('hex')
}

async function getCachedResult(db, cacheKey) {
  const cached = await db.get(
    'SELECT result_json FROM slicing_jobs WHERE params_hash = ? AND status = "completed" ORDER BY created_at DESC LIMIT 1',
    [cacheKey]
  )
  return cached ? JSON.parse(cached.result_json) : null
}

async function saveCachedResult(db, cacheKey, result) {
  // Результат уже сохранен в таблице slicing_jobs при завершении job
  // Дополнительно можно использовать Redis для быстрого доступа
}
```

---

### 3.7 Job Queue (in-memory с возможностью миграции на Redis)

```javascript
// server/modules/slicing/queue.js

class SlicingQueue {
  constructor(maxConcurrency = 2) {
    this.queue = [] // [{ jobId, priority, createdAt }]
    this.running = new Map() // jobId → worker promise
    this.maxConcurrency = maxConcurrency
  }

  add(jobId, priority = 0) {
    this.queue.push({ jobId, priority, createdAt: Date.now() })
    // Сортировка: сначала по priority (desc), потом по createdAt (asc)
    this.queue.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority
      return a.createdAt - b.createdAt
    })
    this.processNext()
  }

  async processNext() {
    if (this.running.size >= this.maxConcurrency) return
    if (this.queue.length === 0) return

    const { jobId } = this.queue.shift()
    
    const workerPromise = this.runWorker(jobId)
    this.running.set(jobId, workerPromise)

    workerPromise
      .then(() => {
        this.running.delete(jobId)
        this.processNext()
      })
      .catch((err) => {
        console.error(`Slicing job ${jobId} failed:`, err)
        this.running.delete(jobId)
        this.processNext()
      })
  }

  async runWorker(jobId) {
    // Загрузить job из БД
    // Запустить CuraEngine
    // Парсить результат
    // Обновить job status в БД
    // ...
  }
}

module.exports = new SlicingQueue(2) // 2 параллельных слайсинга
```

**TODO: уточнить у владельца бизнеса:**
- Максимальное количество параллельных слайсингов (зависит от CPU/RAM сервера)
- Использовать Redis для распределенной очереди (если несколько серверов)?

---

### 3.8 Безопасность и ограничения

#### 3.8.1 Timeout
```javascript
// Таймаут на слайсинг (60 сек)
const SLICING_TIMEOUT = 60000

// Если процесс не завершился — kill
setTimeout(() => {
  if (curaProcess && !curaProcess.killed) {
    curaProcess.kill('SIGTERM')
  }
}, SLICING_TIMEOUT)
```

---

#### 3.8.2 Resource Limits (через Docker или cgroups)
```dockerfile
# Dockerfile для слайсера (опционально изолированный контейнер)
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y cura-engine

# Ограничения
ENV CURA_MAX_MEMORY="512M"
ENV CURA_MAX_CPU="1"

# User (не root для безопасности)
RUN useradd -m sliceruser
USER sliceruser

CMD ["CuraEngine"]
```

---

#### 3.8.3 Cleanup Temp Files
```javascript
// После завершения слайсинга:
const tempGcodePath = `/tmp/slicing_${jobId}.gcode`

// ... slicing ...

// Cleanup
fs.unlinkSync(tempGcodePath)
```

---

### 3.9 Обновление цены после точного расчета

```javascript
// После получения точного времени/филамента из gcode:

const accurateResult = parseGcode(gcodeFilePath)

// Пересчитать стоимость с точными данными
const materialCost = accurateResult.filament_g * material.price_per_gram
const printTimeHours = accurateResult.print_time_sec / 3600
const machineTimeCost = printTimeHours * printerRatePerHour

// Остальное так же (labor, postprocess, margin)

const updatedPrice = calculateTotalPrice({
  materialCost,
  machineTimeCost,
  laborCost,
  postprocessCost,
  marginPercent
})

// Сохранить в quote.accurate_result_json
await db.run(
  'UPDATE quotes SET accurate_result_json = ? WHERE id = ?',
  [JSON.stringify({ price: updatedPrice, time_sec: accurateResult.print_time_sec, breakdown: {...} }), quoteId]
)

// Отправить уведомление пользователю (WebSocket или polling)
```

---

## 4. UX Flow для точного расчета

### 4.1 UI States

```
┌─────────────────────────────────────────────────────────────┐
│  Instant Estimate:                                           │
│  ₽1,250 ≈ | 12 ч ≈ | 3-5 дней                              │
│                                                              │
│  [Получить точный расчет]                                    │
└─────────────────────────────────────────────────────────────┘
                      │ User clicks
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Уточняем расчет...                                          │
│  [Skeleton Loader / Spinner]                                 │
│  Обработка займет 10-30 секунд                               │
└─────────────────────────────────────────────────────────────┘
                      │ Polling /slicing/jobs/:id каждые 2 сек
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Точный расчет:                                              │
│  ₽1,300 | 12.5 ч | 3-5 дней                                 │
│  (разница: +₽50 из-за более точного расчета филамента)      │
│                                                              │
│  [Добавить в заказ]                                          │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.2 Polling vs WebSockets

**Выбор для MVP: Polling**

**Обоснование:**
- Проще в реализации
- Меньше overhead для редких операций (слайсинг не каждую секунду)
- WebSockets можно добавить в Phase 2

**Реализация Polling:**
```javascript
// Frontend composable
async function requestAccurateEstimate(quoteId) {
  const { data } = await api.post(`/pricing/quote/accurate`, { quote_id: quoteId })
  const jobId = data.slicing_job_id
  
  // Polling
  const pollInterval = 2000 // 2 sec
  const maxAttempts = 30 // 60 sec max
  let attempts = 0
  
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      attempts++
      if (attempts > maxAttempts) {
        clearInterval(interval)
        reject(new Error('Timeout'))
        return
      }
      
      const { data: job } = await api.get(`/slicing/jobs/${jobId}`)
      
      if (job.status === 'completed') {
        clearInterval(interval)
        resolve(job)
      } else if (job.status === 'failed') {
        clearInterval(interval)
        reject(new Error(job.error_message))
      }
    }, pollInterval)
  })
}
```

---

## 5. Тестирование и валидация

### 5.1 Unit Tests

```javascript
// server/modules/slicing/__tests__/parser.test.js

describe('Gcode Parser', () => {
  test('should parse print time', () => {
    const gcode = ';TIME:43200\nG1 X0 Y0'
    const result = parseGcode(gcode)
    expect(result.print_time_sec).toBe(43200)
  })
  
  test('should parse filament length', () => {
    const gcode = ';Filament used: 9.5m'
    const result = parseGcode(gcode)
    expect(result.filament_mm).toBe(9500)
  })
})
```

---

### 5.2 Integration Tests

```javascript
// server/modules/slicing/__tests__/integration.test.js

describe('Slicing Integration', () => {
  test('should slice model and return accurate estimate', async () => {
    const modelPath = path.join(__dirname, 'fixtures', 'cube.stl')
    const profilePath = path.join(__dirname, 'fixtures', 'profile.json')
    
    const result = await runCuraEngine({ modelPath, profilePath, outputGcodePath: '/tmp/test.gcode' })
    const parsed = parseGcode(result.gcodeFile)
    
    expect(parsed.print_time_sec).toBeGreaterThan(0)
    expect(parsed.filament_g).toBeGreaterThan(0)
  }, 90000) // 90 sec timeout
})
```

---

## 6. Мониторинг и логирование

### 6.1 Метрики

- **Slicing job duration** (histogram)
- **Slicing success rate** (counter: completed/failed)
- **Queue length** (gauge)
- **Cache hit rate** (counter)

### 6.2 Логи

```javascript
// При запуске job
logger.info('Slicing job started', { jobId, modelId, profileId })

// При завершении
logger.info('Slicing job completed', { jobId, duration_ms, cacheHit: false })

// При ошибке
logger.error('Slicing job failed', { jobId, error: err.message, stderr })
```

---

## 7. Оптимизации (Phase 2)

### 7.1 Параллельный слайсинг на нескольких серверах
- Использовать Redis для распределенной очереди
- Bull/BullMQ для job queue с workers на разных машинах

### 7.2 GPU-ускорение
- Некоторые слайсеры поддерживают GPU (OpenCL)
- Требует специальной настройки

### 7.3 Предиктивное кеширование
- Анализ популярных моделей/параметров
- Пре-слайсинг в off-peak hours

---

**TODO для владельца бизнеса:**
1. Уточнить стоимость материалов за грамм (PLA/ABS/PETG/TPU)
2. Уточнить тарифы принтеров (руб/час)
3. Уточнить трудозатраты (setup fee, fixed labor, labor rate per hour)
4. Уточнить коэффициенты качества (time/price multipliers для Draft/Standard/Fine)
5. Уточнить варианты постобработки и их стоимость
6. Уточнить правила bulk discounts
7. Уточнить минимальную цену заказа
8. Уточнить настройки слайсера (температура, скорость для разных материалов)
9. Уточнить ресурсы сервера для определения max concurrency слайсинга
