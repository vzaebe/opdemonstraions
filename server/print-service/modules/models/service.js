const fs = require('fs')
const dbConnection = require('../../database/connection')
const { sha256File } = require('../../utils/hash')
const STLParser = require('./parser/stl')
const logger = require('../../utils/logger')
const config = require('../../config')
const constants = require('../../config/constants')

/**
 * Models Service
 */
class ModelsService {
  /**
   * Create model from uploaded file
   */
  async createFromFile(file, userId = null) {
    const db = dbConnection.getDb()

    try {
      // Calculate file hash
      const fileHash = sha256File(file.path)

      // Insert file record
      const fileResult = db
        .prepare(
          `
        INSERT INTO files (original_name, stored_name, path, hash, size, mime_type, uploaded_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `
        )
        .run(file.originalname, file.filename, file.path, fileHash, file.size, file.mimetype, userId)

      const fileId = fileResult.lastInsertRowid

      // Determine format
      const format = this.getFormatFromFilename(file.originalname)

      // Parse model
      let metadata
      if (format === 'STL') {
        metadata = await STLParser.parse(file.path)
      } else if (format === '3MF') {
        // TODO: Implement 3MF parser
        metadata = { format: '3MF', bbox: { x: 0, y: 0, z: 0 }, volume: 0, surface_area: 0, triangle_count: 0 }
      } else {
        metadata = { format, bbox: { x: 0, y: 0, z: 0 }, volume: 0, surface_area: 0, triangle_count: 0 }
      }

      // Validate model
      const warnings = this.validateModel(metadata)

      // Insert model record
      const modelResult = db
        .prepare(
          `
        INSERT INTO models (
          file_id, user_id, format, unit,
          bbox_x, bbox_y, bbox_z,
          volume, surface_area,
          is_watertight, is_manifold,
          triangle_count, warnings_json, metadata_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
        )
        .run(
          fileId,
          userId,
          format,
          'mm',
          metadata.bbox.x,
          metadata.bbox.y,
          metadata.bbox.z,
          metadata.volume,
          metadata.surface_area,
          warnings.length === 0 ? 1 : 0, // simplified
          1, // TODO: proper manifold check
          metadata.triangle_count,
          JSON.stringify(warnings),
          JSON.stringify(metadata)
        )

      const modelId = modelResult.lastInsertRowid

      // Get full model data
      const model = this.getById(modelId)

      logger.info('Model created', { modelId, fileId, format, userId })

      return model
    } catch (error) {
      // Cleanup file on error
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }
      throw error
    }
  }

  /**
   * Get model by ID
   */
  getById(modelId) {
    const db = dbConnection.getDb()

    const model = db
      .prepare(
        `
      SELECT
        m.*,
        f.original_name, f.size, f.hash,
        f.path as file_path
      FROM models m
      JOIN files f ON m.file_id = f.id
      WHERE m.id = ?
    `
      )
      .get(modelId)

    if (!model) {
      throw { statusCode: 404, message: 'Model not found' }
    }

    // Parse JSON fields
    model.warnings = model.warnings_json ? JSON.parse(model.warnings_json) : []
    model.metadata = model.metadata_json ? JSON.parse(model.metadata_json) : {}

    // Remove internal fields
    delete model.warnings_json
    delete model.metadata_json
    delete model.file_path

    return model
  }

  /**
   * Get format from filename
   */
  getFormatFromFilename(filename) {
    const ext = filename.split('.').pop().toUpperCase()
    return constants.SUPPORTED_FORMATS.includes(ext) ? ext : 'UNKNOWN'
  }

  /**
   * Validate model and return warnings
   */
  validateModel(metadata) {
    const warnings = []

    // Check dimensions
    if (
      metadata.bbox.x > constants.MAX_MODEL_DIMENSION_MM ||
      metadata.bbox.y > constants.MAX_MODEL_DIMENSION_MM ||
      metadata.bbox.z > constants.MAX_MODEL_DIMENSION_MM
    ) {
      warnings.push(`Модель превышает максимальные размеры (${constants.MAX_MODEL_DIMENSION_MM}мм по одной оси)`)
    }

    // Check volume
    const volumeCm3 = metadata.volume / 1000
    if (volumeCm3 > constants.MAX_MODEL_VOLUME_CM3) {
      warnings.push(`Объем модели превышает максимум (${constants.MAX_MODEL_VOLUME_CM3} см³)`)
    }

    if (volumeCm3 < constants.MIN_MODEL_VOLUME_CM3) {
      warnings.push(`Объем модели слишком мал (минимум ${constants.MIN_MODEL_VOLUME_CM3} см³)`)
    }

    // Check if fits on default printer bed
    if (metadata.bbox.x > constants.DEFAULT_PRINTER_BED_X || metadata.bbox.y > constants.DEFAULT_PRINTER_BED_Y) {
      warnings.push(`Модель не помещается на стандартный стол принтера (${constants.DEFAULT_PRINTER_BED_X}×${constants.DEFAULT_PRINTER_BED_Y} мм). Требуется принтер большого формата.`)
    }

    if (metadata.bbox.z > constants.DEFAULT_PRINTER_BED_Z) {
      warnings.push(`Высота модели превышает стандартный размер (${constants.DEFAULT_PRINTER_BED_Z} мм)`)
    }

    // Check triangle count (performance warning)
    if (metadata.triangle_count > 1000000) {
      warnings.push('Модель содержит очень много полигонов (>1M). Это может замедлить обработку.')
    }

    return warnings
  }

  /**
   * Delete model
   */
  async delete(modelId, userId = null) {
    const db = dbConnection.getDb()

    // Get model
    const model = db.prepare('SELECT * FROM models WHERE id = ?').get(modelId)
    if (!model) {
      throw { statusCode: 404, message: 'Model not found' }
    }

    // Check ownership (if user provided)
    if (userId && model.user_id !== userId) {
      throw { statusCode: 403, message: 'Forbidden' }
    }

    // Get file path
    const file = db.prepare('SELECT path FROM files WHERE id = ?').get(model.file_id)

    // Delete model record (cascade will delete file record)
    db.prepare('DELETE FROM models WHERE id = ?').run(modelId)

    // Delete file from disk
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path)
    }

    logger.info('Model deleted', { modelId, userId })
  }
}

module.exports = new ModelsService()
