const fs = require('fs')
const path = require('path')

/**
 * STL Parser (using node-stl or custom implementation)
 * Для production лучше использовать библиотеку node-stl, но здесь базовая реализация
 */

class STLParser {
  /**
   * Parse STL file and extract metadata
   */
  static async parse(filePath) {
    const buffer = fs.readFileSync(filePath)

    // Detect binary or ASCII
    const isBinary = this.isBinarySTL(buffer)

    if (isBinary) {
      return this.parseBinary(buffer)
    } else {
      return this.parseASCII(buffer.toString())
    }
  }

  /**
   * Check if STL is binary
   */
  static isBinarySTL(buffer) {
    // Binary STL: 80 bytes header + 4 bytes triangle count
    if (buffer.length < 84) return false

    // Try to detect ASCII by looking for "solid" keyword
    const header = buffer.toString('utf8', 0, 80).toLowerCase()
    if (header.includes('solid')) {
      // Could be ASCII, check further
      const content = buffer.toString('utf8')
      return !content.includes('facet') || !content.includes('vertex')
    }

    return true
  }

  /**
   * Parse binary STL
   */
  static parseBinary(buffer) {
    // Header: 80 bytes
    // Triangle count: 4 bytes (uint32, little-endian)
    const triangleCount = buffer.readUInt32LE(80)

    let minX = Infinity,
      minY = Infinity,
      minZ = Infinity
    let maxX = -Infinity,
      maxY = -Infinity,
      maxZ = -Infinity

    let volume = 0

    // Each triangle: 12 floats (3 for normal, 9 for vertices) + 2 bytes attribute
    // = 50 bytes per triangle
    const triangleSize = 50
    let offset = 84

    for (let i = 0; i < triangleCount; i++) {
      // Skip normal (12 bytes)
      offset += 12

      // Read 3 vertices
      const vertices = []
      for (let j = 0; j < 3; j++) {
        const x = buffer.readFloatLE(offset)
        const y = buffer.readFloatLE(offset + 4)
        const z = buffer.readFloatLE(offset + 8)
        vertices.push({ x, y, z })
        offset += 12

        // Update bounding box
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        minZ = Math.min(minZ, z)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
        maxZ = Math.max(maxZ, z)
      }

      // Calculate volume contribution (signed volume of tetrahedron)
      volume += this.signedVolumeOfTriangle(vertices[0], vertices[1], vertices[2])

      // Skip attribute (2 bytes)
      offset += 2
    }

    const bbox = {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ,
    }

    // Volume is absolute value
    volume = Math.abs(volume)

    // Approximate surface area (simple estimate)
    const surfaceArea = this.calculateSurfaceArea(bbox, triangleCount)

    return {
      format: 'STL',
      bbox,
      volume,
      surface_area: surfaceArea,
      triangle_count: triangleCount,
      is_binary: true,
    }
  }

  /**
   * Parse ASCII STL
   */
  static parseASCII(content) {
    const lines = content.split('\n')
    let triangleCount = 0

    let minX = Infinity,
      minY = Infinity,
      minZ = Infinity
    let maxX = -Infinity,
      maxY = -Infinity,
      maxZ = -Infinity

    const vertexRegex = /vertex\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/

    for (const line of lines) {
      if (line.trim().startsWith('facet')) {
        triangleCount++
      }

      const match = line.match(vertexRegex)
      if (match) {
        const x = parseFloat(match[1])
        const y = parseFloat(match[3])
        const z = parseFloat(match[5])

        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        minZ = Math.min(minZ, z)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
        maxZ = Math.max(maxZ, z)
      }
    }

    const bbox = {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ,
    }

    // Approximate volume (для ASCII сложнее вычислить точно без всех вершин)
    const volume = bbox.x * bbox.y * bbox.z * 0.5 // грубая оценка

    const surfaceArea = this.calculateSurfaceArea(bbox, triangleCount)

    return {
      format: 'STL',
      bbox,
      volume,
      surface_area: surfaceArea,
      triangle_count: triangleCount,
      is_binary: false,
    }
  }

  /**
   * Calculate signed volume of triangle
   */
  static signedVolumeOfTriangle(p1, p2, p3) {
    return p1.x * (p2.y * p3.z - p3.y * p2.z) - p1.y * (p2.x * p3.z - p3.x * p2.z) + p1.z * (p2.x * p3.y - p3.x * p2.y)
  }

  /**
   * Calculate approximate surface area
   */
  static calculateSurfaceArea(bbox, triangleCount) {
    // Приблизительная оценка на основе bbox и количества треугольников
    // Для точного расчета нужно суммировать площади всех треугольников
    const avgTriangleArea = (bbox.x * bbox.y + bbox.y * bbox.z + bbox.z * bbox.x) / (triangleCount / 100)
    return avgTriangleArea * triangleCount
  }
}

module.exports = STLParser
