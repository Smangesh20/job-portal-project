import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';
import { CacheService } from '@/utils/redis';
import { NotFoundError, ValidationError } from '@ask-ya-cham/types';
import { getFileUrl, validateFileUpload, formatFileSize, getFileType } from '@/middleware/upload';
import AWS from 'aws-sdk';

export class FileService {
  private prisma: PrismaClient;
  private cacheService: CacheService;
  private s3: AWS.S3;

  constructor() {
    this.prisma = new PrismaClient();
    this.cacheService = new CacheService();
    
    // Initialize AWS S3
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<string> {
    try {
      validateFileUpload(file, 'avatars');

      const fileName = `avatars/${userId}/${Date.now()}_${file.originalname}`;
      const uploadResult = await this.uploadToS3(file, fileName);

      // Update user profile with avatar URL
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          avatarUrl: uploadResult.Location,
          updatedAt: new Date()
        }
      });

      // Invalidate user cache
      await this.cacheService.del(`user:${userId}`);

      // Log file upload
      await this.logFileUpload(userId, 'AVATAR', uploadResult.Location, file.size);

      return uploadResult.Location;
    } catch (error) {
      logger.error('Error uploading avatar:', error);
      throw error;
    }
  }

  /**
   * Delete avatar
   */
  async deleteAvatar(userId: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { avatarUrl: true }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.avatarUrl) {
        // Extract S3 key from URL
        const s3Key = this.extractS3Key(user.avatarUrl);
        
        if (s3Key) {
          await this.deleteFromS3(s3Key);
        }
      }

      // Update user profile to remove avatar URL
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          avatarUrl: null,
          updatedAt: new Date()
        }
      });

      // Invalidate user cache
      await this.cacheService.del(`user:${userId}`);

      logger.info(`Avatar deleted for user ${userId}`);
    } catch (error) {
      logger.error('Error deleting avatar:', error);
      throw error;
    }
  }

  /**
   * Upload resume
   */
  async uploadResume(userId: string, file: Express.Multer.File): Promise<string> {
    try {
      validateFileUpload(file, 'resumes');

      const fileName = `resumes/${userId}/${Date.now()}_${file.originalname}`;
      const uploadResult = await this.uploadToS3(file, fileName);

      // Update user profile with resume URL
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          resumeUrl: uploadResult.Location,
          updatedAt: new Date()
        }
      });

      // Invalidate user cache
      await this.cacheService.del(`user:${userId}`);

      // Log file upload
      await this.logFileUpload(userId, 'RESUME', uploadResult.Location, file.size);

      return uploadResult.Location;
    } catch (error) {
      logger.error('Error uploading resume:', error);
      throw error;
    }
  }

  /**
   * Get resume
   */
  async getResume(userId: string): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { resumeUrl: true }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (!user.resumeUrl) {
        throw new NotFoundError('Resume not found');
      }

      return user.resumeUrl;
    } catch (error) {
      logger.error('Error getting resume:', error);
      throw error;
    }
  }

  /**
   * Delete resume
   */
  async deleteResume(userId: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { resumeUrl: true }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.resumeUrl) {
        // Extract S3 key from URL
        const s3Key = this.extractS3Key(user.resumeUrl);
        
        if (s3Key) {
          await this.deleteFromS3(s3Key);
        }
      }

      // Update user profile to remove resume URL
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          resumeUrl: null,
          updatedAt: new Date()
        }
      });

      // Invalidate user cache
      await this.cacheService.del(`user:${userId}`);

      logger.info(`Resume deleted for user ${userId}`);
    } catch (error) {
      logger.error('Error deleting resume:', error);
      throw error;
    }
  }

  /**
   * Upload portfolio file
   */
  async uploadPortfolioFile(userId: string, file: Express.Multer.File): Promise<string> {
    try {
      validateFileUpload(file, 'portfolios');

      const fileName = `portfolios/${userId}/${Date.now()}_${file.originalname}`;
      const uploadResult = await this.uploadToS3(file, fileName);

      // Store portfolio file record
      await this.prisma.portfolioFile.create({
        data: {
          userId,
          fileName: file.originalname,
          fileUrl: uploadResult.Location,
          fileSize: file.size,
          fileType: getFileType(file.mimetype),
          mimeType: file.mimetype
        }
      });

      // Log file upload
      await this.logFileUpload(userId, 'PORTFOLIO', uploadResult.Location, file.size);

      return uploadResult.Location;
    } catch (error) {
      logger.error('Error uploading portfolio file:', error);
      throw error;
    }
  }

  /**
   * Get user portfolio files
   */
  async getPortfolioFiles(userId: string): Promise<any[]> {
    try {
      const files = await this.prisma.portfolioFile.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      return files;
    } catch (error) {
      logger.error('Error getting portfolio files:', error);
      throw error;
    }
  }

  /**
   * Delete portfolio file
   */
  async deletePortfolioFile(fileId: string, userId: string): Promise<void> {
    try {
      const file = await this.prisma.portfolioFile.findFirst({
        where: { id: fileId, userId }
      });

      if (!file) {
        throw new NotFoundError('Portfolio file not found');
      }

      // Delete from S3
      const s3Key = this.extractS3Key(file.fileUrl);
      if (s3Key) {
        await this.deleteFromS3(s3Key);
      }

      // Delete from database
      await this.prisma.portfolioFile.delete({
        where: { id: fileId }
      });

      logger.info(`Portfolio file deleted: ${fileId}`);
    } catch (error) {
      logger.error('Error deleting portfolio file:', error);
      throw error;
    }
  }

  /**
   * Upload application document
   */
  async uploadApplicationDocument(applicationId: string, file: Express.Multer.File): Promise<string> {
    try {
      validateFileUpload(file, 'documents');

      const fileName = `applications/${applicationId}/${Date.now()}_${file.originalname}`;
      const uploadResult = await this.uploadToS3(file, fileName);

      // Store application document record
      await this.prisma.applicationDocument.create({
        data: {
          applicationId,
          fileName: file.originalname,
          fileUrl: uploadResult.Location,
          fileSize: file.size,
          fileType: getFileType(file.mimetype),
          mimeType: file.mimetype
        }
      });

      return uploadResult.Location;
    } catch (error) {
      logger.error('Error uploading application document:', error);
      throw error;
    }
  }

  /**
   * Generate presigned URL for file access
   */
  async generatePresignedUrl(fileUrl: string, expiresIn: number = 3600): Promise<string> {
    try {
      const s3Key = this.extractS3Key(fileUrl);
      
      if (!s3Key) {
        throw new ValidationError('Invalid file URL');
      }

      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Expires: expiresIn
      };

      const presignedUrl = await this.s3.getSignedUrlPromise('getObject', params);
      return presignedUrl;
    } catch (error) {
      logger.error('Error generating presigned URL:', error);
      throw error;
    }
  }

  /**
   * Upload to S3
   */
  private async uploadToS3(file: Express.Multer.File, fileName: string): Promise<AWS.S3.ManagedUpload.SendData> {
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private' // Make files private by default
      };

      const uploadResult = await this.s3.upload(params).promise();
      return uploadResult;
    } catch (error) {
      logger.error('Error uploading to S3:', error);
      throw error;
    }
  }

  /**
   * Delete from S3
   */
  private async deleteFromS3(s3Key: string): Promise<void> {
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: s3Key
      };

      await this.s3.deleteObject(params).promise();
      logger.info(`File deleted from S3: ${s3Key}`);
    } catch (error) {
      logger.error('Error deleting from S3:', error);
      throw error;
    }
  }

  /**
   * Extract S3 key from URL
   */
  private extractS3Key(fileUrl: string): string | null {
    try {
      const url = new URL(fileUrl);
      const pathname = url.pathname;
      
      // Remove leading slash
      return pathname.startsWith('/') ? pathname.slice(1) : pathname;
    } catch (error) {
      logger.error('Error extracting S3 key:', error);
      return null;
    }
  }

  /**
   * Log file upload
   */
  private async logFileUpload(userId: string, fileType: string, fileUrl: string, fileSize: number): Promise<void> {
    try {
      await this.prisma.activityLog.create({
        data: {
          userId,
          action: 'FILE_UPLOADED',
          description: `${fileType} file uploaded`,
          metadata: {
            fileType,
            fileUrl,
            fileSize,
            formattedSize: formatFileSize(fileSize)
          }
        }
      });
    } catch (error) {
      logger.error('Error logging file upload:', error);
      // Don't throw error here as it's just logging
    }
  }

  /**
   * Get file statistics
   */
  async getFileStatistics(userId?: string): Promise<any> {
    try {
      const where = userId ? { userId } : {};

      const [
        totalFiles,
        totalSize,
        filesByType,
        recentUploads
      ] = await Promise.all([
        this.prisma.portfolioFile.count({ where }),
        this.prisma.portfolioFile.aggregate({
          where,
          _sum: { fileSize: true }
        }),
        this.prisma.portfolioFile.groupBy({
          by: ['fileType'],
          where,
          _count: { fileType: true },
          _sum: { fileSize: true }
        }),
        this.prisma.portfolioFile.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            fileName: true,
            fileSize: true,
            fileType: true,
            createdAt: true
          }
        })
      ]);

      return {
        totalFiles,
        totalSize: totalSize._sum.fileSize || 0,
        formattedTotalSize: formatFileSize(totalSize._sum.fileSize || 0),
        filesByType: filesByType.map(item => ({
          type: item.fileType,
          count: item._count.fileType,
          size: item._sum.fileSize || 0,
          formattedSize: formatFileSize(item._sum.fileSize || 0)
        })),
        recentUploads
      };
    } catch (error) {
      logger.error('Error getting file statistics:', error);
      throw error;
    }
  }

  /**
   * Clean up orphaned files
   */
  async cleanupOrphanedFiles(): Promise<number> {
    try {
      // This would implement logic to find and delete files that are no longer referenced
      // in the database but still exist in S3
      
      // For now, return 0 as this is a complex operation that would require
      // scanning S3 and comparing with database records
      
      logger.info('Orphaned files cleanup completed');
      return 0;
    } catch (error) {
      logger.error('Error cleaning up orphaned files:', error);
      throw error;
    }
  }
}
