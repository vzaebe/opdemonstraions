const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const config = require('../../config')
const constants = require('../../config/constants')

// Ensure upload directory exists
if (!fs.existsSync(config.storage.uploads)) {
  fs.mkdirSync(config.storage.uploads, { recursive: true })
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.storage.uploads)
  },
  filename: (req, file, cb) => {
    // Generate unique filename: UUID + original extension
    const uniqueName = crypto.randomBytes(16).toString('hex')
    const ext = path.extname(file.originalname)
    cb(null, `${uniqueName}${ext}`)
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()

  if (!config.upload.allowedExtensions.includes(ext)) {
    return cb(
      new Error(`Invalid file type. Allowed: ${config.upload.allowedExtensions.join(', ')}`),
      false
    )
  }

  cb(null, true)
}

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSizeBytes,
    files: config.upload.maxFilesPerUpload,
  },
})

module.exports = {
  single: upload.single('file'),
  multiple: upload.array('files', config.upload.maxFilesPerUpload),
  upload,
}
