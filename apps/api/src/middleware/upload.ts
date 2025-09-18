import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { logger } from '@/utils/logger';

// Ensure upload directories exist
const uploadDirs = {
  avatars: path.join(process.cwd(), 'uploads', 'avatars'),
  resumes: path.join(process.cwd(), 'uploads', 'resumes'),
  documents: path.join(process.cwd(), 'uploads', 'documents'),
  portfolios: path.join(process.cwd(), 'uploads', 'portfolios')
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// File type validation
const allowedMimeTypes = {
  avatars: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  resumes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  portfolios: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']
};

const fileSizeLimits = {
  avatars: 5 * 1024 * 1024, // 5MB
  resumes: 10 * 1024 * 1024, // 10MB
  documents: 10 * 1024 * 1024, // 10MB
  portfolios: 25 * 1024 * 1024 // 25MB
};

// Generate unique filename
const generateFileName = (originalName: string, userId: string): string => {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${userId}_${timestamp}_${random}${ext}`;
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    const uploadType = req.params.type || 'documents';
    const uploadDir = uploadDirs[uploadType as keyof typeof uploadDirs] || uploadDirs.documents;
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const userId = req.user?.id || 'anonymous';
    const fileName = generateFileName(file.originalname, userId);
    cb(null, fileName);
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  const uploadType = req.params.type || 'documents';
  const allowedTypes = allowedMimeTypes[uploadType as keyof typeof allowedMimeTypes] || allowedMimeTypes.documents;
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    error.name = 'InvalidFileType';
    cb(error, false);
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max
    files: 5 // Max 5 files per request
  }
});

// Specific upload configurations
export const avatarUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirs.avatars);
    },
    filename: (req, file, cb) => {
      const userId = req.user?.id || 'anonymous';
      const fileName = generateFileName(file.originalname, userId);
      cb(null, fileName);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.avatars.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(`Invalid avatar file type. Allowed types: ${allowedMimeTypes.avatars.join(', ')}`);
      error.name = 'InvalidFileType';
      cb(error, false);
    }
  },
  limits: {
    fileSize: fileSizeLimits.avatars,
    files: 1
  }
});

export const resumeUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirs.resumes);
    },
    filename: (req, file, cb) => {
      const userId = req.user?.id || 'anonymous';
      const fileName = generateFileName(file.originalname, userId);
      cb(null, fileName);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.resumes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(`Invalid resume file type. Allowed types: ${allowedMimeTypes.resumes.join(', ')}`);
      error.name = 'InvalidFileType';
      cb(error, false);
    }
  },
  limits: {
    fileSize: fileSizeLimits.resumes,
    files: 1
  }
});

export const documentUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirs.documents);
    },
    filename: (req, file, cb) => {
      const userId = req.user?.id || 'anonymous';
      const fileName = generateFileName(file.originalname, userId);
      cb(null, fileName);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.documents.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(`Invalid document file type. Allowed types: ${allowedMimeTypes.documents.join(', ')}`);
      error.name = 'InvalidFileType';
      cb(error, false);
    }
  },
  limits: {
    fileSize: fileSizeLimits.documents,
    files: 5
  }
});

export const portfolioUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirs.portfolios);
    },
    filename: (req, file, cb) => {
      const userId = req.user?.id || 'anonymous';
      const fileName = generateFileName(file.originalname, userId);
      cb(null, fileName);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.portfolios.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(`Invalid portfolio file type. Allowed types: ${allowedMimeTypes.portfolios.join(', ')}`);
      error.name = 'InvalidFileType';
      cb(error, false);
    }
  },
  limits: {
    fileSize: fileSizeLimits.portfolios,
    files: 10
  }
});

// Error handling middleware
export const handleUploadError = (error: any, req: Request, res: any, next: Function) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: 'File size exceeds the maximum allowed limit'
          }
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: {
            code: 'TOO_MANY_FILES',
            message: 'Too many files uploaded'
          }
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: {
            code: 'UNEXPECTED_FILE_FIELD',
            message: 'Unexpected file field'
          }
        });
      default:
        return res.status(400).json({
          success: false,
          error: {
            code: 'UPLOAD_ERROR',
            message: 'File upload error'
          }
        });
    }
  }

  if (error.name === 'InvalidFileType') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_FILE_TYPE',
        message: error.message
      }
    });
  }

  next(error);
};

// File cleanup utility
export const cleanupFiles = async (filePaths: string[]): Promise<void> => {
  for (const filePath of filePaths) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`Deleted file: ${filePath}`);
      }
    } catch (error) {
      logger.error(`Error deleting file ${filePath}:`, error);
    }
  }
};

// Get file URL
export const getFileUrl = (filePath: string, baseUrl?: string): string => {
  const base = baseUrl || process.env.BASE_URL || 'http://localhost:3001';
  const relativePath = filePath.replace(process.cwd(), '').replace(/\\/g, '/');
  return `${base}${relativePath}`;
};

// Validate file upload
export const validateFileUpload = (file: Express.Multer.File, uploadType: string): void => {
  if (!file) {
    throw new Error('No file uploaded');
  }

  const allowedTypes = allowedMimeTypes[uploadType as keyof typeof allowedMimeTypes];
  const sizeLimit = fileSizeLimits[uploadType as keyof typeof fileSizeLimits];

  if (!allowedTypes?.includes(file.mimetype)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes?.join(', ')}`);
  }

  if (file.size > sizeLimit!) {
    throw new Error(`File size exceeds limit of ${sizeLimit! / (1024 * 1024)}MB`);
  }
};

// File type detection
export const getFileType = (mimetype: string): string => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  if (mimetype.includes('pdf')) return 'pdf';
  if (mimetype.includes('word') || mimetype.includes('document')) return 'document';
  if (mimetype.includes('sheet') || mimetype.includes('excel')) return 'spreadsheet';
  if (mimetype.includes('presentation') || mimetype.includes('powerpoint')) return 'presentation';
  return 'other';
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default {
  upload,
  avatarUpload,
  resumeUpload,
  documentUpload,
  portfolioUpload,
  handleUploadError,
  cleanupFiles,
  getFileUrl,
  validateFileUpload,
  getFileType,
  formatFileSize
};
