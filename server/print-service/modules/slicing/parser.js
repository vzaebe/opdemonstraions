/**
 * STL File Parser
 * Supports both Binary and ASCII STL formats
 */

const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)

class STLParser {
  /**
   * Parse STL file and extract metadata
   * @param {string} filePath - Path to STL file
   * @returns {Promise<Object>} Parsed model data with metadata
   */
  async parse(filePath) {
    const buffer = await readFile(filePath)
    const isBinary = this.isBinarySTL(buffer)

    if (isBinary) {
      return this.parseBinarySTL(buffer)
    } else {
      return this.parseASCIISTL(buffer)
    }
  }

  /**
   * Detect if STL is binary or ASCII
   * @param {Buffer} buffer - File buffer
   * @returns {boolean}
   */
  isBinarySTL(buffer) {
    // ASCII STL files start with "solid"
    const header = buffer.toString('utf8', 0, 80).trim()
    if (!header.toLowerCase().startsWith('solid')) {
      return true
    }

    // Check if it's really ASCII by looking for "facet" keyword
    const sample = buffer.toString('utf8', 0, Math.min(1000, buffer.length))
    if (sample.includes('facet') && sample.includes('vertex')) {
      return false
    }

    return true
  }

  /**
   * Parse Binary STL
   * Binary STL format:
   * - 80 bytes: Header
   * - 4 bytes: Number of triangles (uint32)
   * - For each triangle (50 bytes):
   *   - 12 bytes: Normal vector (3 floats)
   *   - 36 bytes: 3 vertices (9 floats)
   *   - 2 bytes: Attribute byte count
   */
  parseBinarySTL(buffer) {
    const triangleCount = buffer.readUInt32LE(80)
    const vertices = []
    const normals = []
    let minX = Infinity, minY = Infinity, minZ = Infinity
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity

    let offset = 84 // Skip header (80) and triangle count (4)

    for (let i = 0; i < triangleCount; i++) {
      // Read normal vector
      const nx = buffer.readFloatLE(offset)
      const ny = buffer.readFloatLE(offset + 4)
      const nz = buffer.readFloatLE(offset + 8)
      normals.push({ x: nx, y: ny, z: nz })
      offset += 12

      // Read 3 vertices
      const triangle = []
      for (let j = 0; j < 3; j++) {
        const x = buffer.readFloatLE(offset)
        const y = buffer.readFloatLE(offset + 4)
        const z = buffer.readFloatLE(offset + 8)

        triangle.push({ x, y, z })
        vertices.push({ x, y, z })

        // Update bounding box
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        minZ = Math.min(minZ, z)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
        maxZ = Math.max(maxZ, z)

        offset += 12
      }

      // Skip attribute byte count
      offset += 2
    }

    // Calculate dimensions
    const bbox = {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ,
    }

    // Calculate volume using signed volume of tetrahedron method
    const volume = this.calculateVolume(vertices, triangleCount)

    // Calculate surface area
    const surfaceArea = this.calculateSurfaceArea(vertices, triangleCount)

    return {
      format: 'stl',
      type: 'binary',
      triangleCount,
      vertexCount: vertices.length,
      bbox,
      volume: Math.abs(volume),
      surfaceArea,
      bounds: {
        min: { x: minX, y: minY, z: minZ },
        max: { x: maxX, y: maxY, z: maxZ },
      },
    }
  }

  /**
   * Parse ASCII STL
   * ASCII STL format example:
   * solid name
   *   facet normal nx ny nz
   *     outer loop
   *       vertex x1 y1 z1
   *       vertex x2 y2 z2
   *       vertex x3 y3 z3
   *     endloop
   *   endfacet
   * endsolid name
   */
  parseASCIISTL(buffer) {
    const text = buffer.toString('utf8')
    const lines = text.split('\n').map((line) => line.trim())

    const vertices = []
    let triangleCount = 0
    let minX = Infinity, minY = Infinity, minZ = Infinity
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity

    for (const line of lines) {
      if (line.startsWith('vertex')) {
        const parts = line.split(/\s+/)
        const x = parseFloat(parts[1])
        const y = parseFloat(parts[2])
        const z = parseFloat(parts[3])

        if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
          vertices.push({ x, y, z })

          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          minZ = Math.min(minZ, z)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
          maxZ = Math.max(maxZ, z)
        }
      } else if (line.startsWith('endfacet')) {
        triangleCount++
      }
    }

    const bbox = {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ,
    }

    const volume = this.calculateVolume(vertices, triangleCount)
    const surfaceArea = this.calculateSurfaceArea(vertices, triangleCount)

    return {
      format: 'stl',
      type: 'ascii',
      triangleCount,
      vertexCount: vertices.length,
      bbox,
      volume: Math.abs(volume),
      surfaceArea,
      bounds: {
        min: { x: minX, y: minY, z: minZ },
        max: { x: maxX, y: maxY, z: maxZ },
      },
    }
  }

  /**
   * Calculate volume using signed volume of tetrahedron method
   * @param {Array} vertices - Array of vertices
   * @param {number} triangleCount - Number of triangles
   * @returns {number} Volume in cubic units
   */
  calculateVolume(vertices, triangleCount) {
    let volume = 0

    for (let i = 0; i < triangleCount; i++) {
      const v1 = vertices[i * 3]
      const v2 = vertices[i * 3 + 1]
      const v3 = vertices[i * 3 + 2]

      if (v1 && v2 && v3) {
        // Signed volume of tetrahedron
        volume += this.signedVolumeOfTriangle(v1, v2, v3)
      }
    }

    return Math.abs(volume)
  }

  /**
   * Calculate signed volume of triangle with origin
   * @param {Object} p1 - First vertex
   * @param {Object} p2 - Second vertex
   * @param {Object} p3 - Third vertex
   * @returns {number}
   */
  signedVolumeOfTriangle(p1, p2, p3) {
    return (
      (p1.x * p2.y * p3.z -
        p1.x * p3.y * p2.z -
        p2.x * p1.y * p3.z +
        p2.x * p3.y * p1.z +
        p3.x * p1.y * p2.z -
        p3.x * p2.y * p1.z) /
      6.0
    )
  }

  /**
   * Calculate surface area
   * @param {Array} vertices - Array of vertices
   * @param {number} triangleCount - Number of triangles
   * @returns {number} Surface area in square units
   */
  calculateSurfaceArea(vertices, triangleCount) {
    let area = 0

    for (let i = 0; i < triangleCount; i++) {
      const v1 = vertices[i * 3]
      const v2 = vertices[i * 3 + 1]
      const v3 = vertices[i * 3 + 2]

      if (v1 && v2 && v3) {
        // Calculate triangle area using cross product
        const ax = v2.x - v1.x
        const ay = v2.y - v1.y
        const az = v2.z - v1.z

        const bx = v3.x - v1.x
        const by = v3.y - v1.y
        const bz = v3.z - v1.z

        // Cross product
        const cx = ay * bz - az * by
        const cy = az * bx - ax * bz
        const cz = ax * by - ay * bx

        // Magnitude / 2
        area += Math.sqrt(cx * cx + cy * cy + cz * cz) / 2
      }
    }

    return area
  }

  /**
   * Validate model integrity
   * @param {Object} metadata - Parsed metadata
   * @returns {Object} Validation result with warnings
   */
  validate(metadata) {
    const warnings = []

    // Check if model is too small
    if (metadata.volume < 1) {
      warnings.push('Model volume is very small (< 1mm³). Check units.')
    }

    // Check if model is too large
    if (metadata.bbox.x > 300 || metadata.bbox.y > 300 || metadata.bbox.z > 300) {
      warnings.push('Model exceeds typical print bed size (300mm). May need splitting.')
    }

    // Check aspect ratio
    const maxDim = Math.max(metadata.bbox.x, metadata.bbox.y, metadata.bbox.z)
    const minDim = Math.min(metadata.bbox.x, metadata.bbox.y, metadata.bbox.z)
    if (maxDim / minDim > 100) {
      warnings.push('Extreme aspect ratio detected. May cause printing issues.')
    }

    // Check triangle count
    if (metadata.triangleCount > 1000000) {
      warnings.push('Very high triangle count. Consider mesh decimation.')
    }

    return {
      valid: warnings.length === 0,
      warnings,
    }
  }
}

module.exports = new STLParser()
