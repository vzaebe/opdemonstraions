/**
 * Slicing Service
 * Manages slicing jobs queue and coordination
 */

const slicer = require('./slicer')
const stlParser = require('./parser')
const dbConnection = require('../../database/connection')
const logger = require('../../utils/logger')

class SlicingService {
  constructor() {
    this.db = dbConnection.getDatabase()
  }

  /**
   * Create slicing job
   * @param {Object} params - Job parameters
   * @returns {Promise<Object>} Created job
   */
  async createJob(params) {
    const { modelId, profileId, materialId, infill, supports } = params

    // Get model info
    const model = this.db
      .prepare('SELECT * FROM models WHERE id = ?')
      .get(modelId)

    if (!model) {
      throw new Error('Model not found')
    }

    // Get file path
    const file = this.db
      .prepare('SELECT * FROM files WHERE id = ?')
      .get(model.file_id)

    if (!file) {
      throw new Error('Model file not found')
    }

    // Generate params hash for caching
    const paramsHash = slicer.generateCacheKey({
      modelHash: file.hash,
      profileId,
      materialId,
      infill,
      supports,
    })

    // Check if job already exists
    const existing = this.db
      .prepare(
        'SELECT * FROM slicing_jobs WHERE model_id = ? AND params_hash = ? AND status IN (?, ?)'
      )
      .get(modelId, paramsHash, 'pending', 'processing')

    if (existing) {
      return existing
    }

    // Create new job
    const result = this.db
      .prepare(
        `INSERT INTO slicing_jobs 
        (model_id, profile_id, params_hash, status, params_json, created_at) 
        VALUES (?, ?, ?, ?, ?, datetime('now'))`
      )
      .run(
        modelId,
        profileId,
        paramsHash,
        'pending',
        JSON.stringify({ materialId, infill, supports })
      )

    const job = this.db
      .prepare('SELECT * FROM slicing_jobs WHERE id = ?')
      .get(result.lastInsertRowid)

    // Process job asynchronously
    this.processJob(job.id).catch((err) => {
      logger.error('Job processing error', err)
    })

    return job
  }

  /**
   * Process slicing job
   * @param {number} jobId - Job ID
   */
  async processJob(jobId) {
    // Update status to processing
    this.db
      .prepare("UPDATE slicing_jobs SET status = 'processing', started_at = datetime('now') WHERE id = ?")
      .run(jobId)

    try {
      const job = this.db
        .prepare('SELECT * FROM slicing_jobs WHERE id = ?')
        .get(jobId)

      const model = this.db
        .prepare('SELECT * FROM models WHERE id = ?')
        .get(job.model_id)

      const file = this.db
        .prepare('SELECT * FROM files WHERE id = ?')
        .get(model.file_id)

      const params = JSON.parse(job.params_json)

      // Execute slicing
      const result = await slicer.slice({
        modelPath: file.path,
        modelHash: file.hash,
        profileId: job.profile_id,
        materialId: params.materialId,
        infill: params.infill,
        supports: params.supports,
      })

      // Update job with result
      this.db
        .prepare(
          `UPDATE slicing_jobs 
          SET status = 'completed', 
              result_json = ?, 
              finished_at = datetime('now') 
          WHERE id = ?`
        )
        .run(JSON.stringify(result), jobId)

      logger.info('Slicing job completed', { jobId, result })
    } catch (error) {
      logger.error('Slicing job failed', { jobId, error })

      this.db
        .prepare(
          `UPDATE slicing_jobs 
          SET status = 'failed', 
              error_message = ?, 
              finished_at = datetime('now') 
          WHERE id = ?`
        )
        .run(error.message, jobId)
    }
  }

  /**
   * Get job status
   * @param {number} jobId - Job ID
   * @returns {Object} Job data
   */
  getJob(jobId) {
    const job = this.db
      .prepare('SELECT * FROM slicing_jobs WHERE id = ?')
      .get(jobId)

    if (!job) {
      throw new Error('Job not found')
    }

    return {
      ...job,
      params: job.params_json ? JSON.parse(job.params_json) : null,
      result: job.result_json ? JSON.parse(job.result_json) : null,
    }
  }

  /**
   * Parse STL file and extract metadata
   * @param {string} filePath - Path to STL file
   * @returns {Promise<Object>} Parsed metadata
   */
  async parseSTL(filePath) {
    const metadata = await stlParser.parse(filePath)
    const validation = stlParser.validate(metadata)
    
    return {
      ...metadata,
      validation,
    }
  }

  /**
   * Check slicer availability
   * @returns {Promise<Object>}
   */
  async checkSlicerStatus() {
    const available = await slicer.isAvailable()
    return {
      available,
      engine: slicer.curaEnginePath,
      maxParallelJobs: slicer.maxParallelJobs,
      currentJobs: slicer.currentJobs,
    }
  }

  /**
   * Get slicing jobs statistics
   * @returns {Object}
   */
  getStats() {
    const total = this.db
      .prepare('SELECT COUNT(*) as count FROM slicing_jobs')
      .get().count

    const pending = this.db
      .prepare("SELECT COUNT(*) as count FROM slicing_jobs WHERE status = 'pending'")
      .get().count

    const processing = this.db
      .prepare("SELECT COUNT(*) as count FROM slicing_jobs WHERE status = 'processing'")
      .get().count

    const completed = this.db
      .prepare("SELECT COUNT(*) as count FROM slicing_jobs WHERE status = 'completed'")
      .get().count

    const failed = this.db
      .prepare("SELECT COUNT(*) as count FROM slicing_jobs WHERE status = 'failed'")
      .get().count

    return {
      total,
      pending,
      processing,
      completed,
      failed,
    }
  }
}

module.exports = new SlicingService()
