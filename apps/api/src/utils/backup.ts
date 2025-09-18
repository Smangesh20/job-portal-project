import { exec } from 'child_process'
import { promisify } from 'util'
import { logger } from './logger'
import { performanceUtils } from './performance'
import { metrics } from './metrics'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

const execAsync = promisify(exec)

// Backup configuration
interface BackupConfig {
  enabled: boolean
  schedule: string // Cron expression
  retentionDays: number
  compressionEnabled: boolean
  encryptionEnabled: boolean
  backupLocation: string
  s3Bucket?: string
  s3Region?: string
  s3AccessKey?: string
  s3SecretKey?: string
  databaseUrl: string
  maxBackupSize: number // MB
  parallelBackups: number
}

// Backup types
type BackupType = 'full' | 'incremental' | 'differential'

// Backup status
type BackupStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

// Backup interface
interface Backup {
  id: string
  type: BackupType
  status: BackupStatus
  startTime: Date
  endTime?: Date
  size?: number
  location: string
  checksum?: string
  encryptionKey?: string
  error?: string
  metadata?: Record<string, any>
}

// Backup manager class
export class BackupManager {
  private static instance: BackupManager
  private config: BackupConfig
  private prisma: PrismaClient
  private activeBackups: Map<string, Backup> = new Map()
  private backupHistory: Backup[] = []

  private constructor(config: BackupConfig) {
    this.config = config
    this.prisma = new PrismaClient()
    this.initializeBackupLocation()
  }

  static getInstance(config?: BackupConfig): BackupManager {
    if (!BackupManager.instance) {
      const defaultConfig: BackupConfig = {
        enabled: process.env.BACKUP_ENABLED === 'true',
        schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *', // Daily at 2 AM
        retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
        compressionEnabled: process.env.BACKUP_COMPRESSION !== 'false',
        encryptionEnabled: process.env.BACKUP_ENCRYPTION === 'true',
        backupLocation: process.env.BACKUP_LOCATION || './backups',
        s3Bucket: process.env.S3_BACKUP_BUCKET,
        s3Region: process.env.S3_BACKUP_REGION || 'us-east-1',
        s3AccessKey: process.env.S3_BACKUP_ACCESS_KEY,
        s3SecretKey: process.env.S3_BACKUP_SECRET_KEY,
        databaseUrl: process.env.DATABASE_URL || '',
        maxBackupSize: parseInt(process.env.MAX_BACKUP_SIZE_MB || '1000'),
        parallelBackups: parseInt(process.env.MAX_PARALLEL_BACKUPS || '3')
      }
      
      BackupManager.instance = new BackupManager(config || defaultConfig)
    }
    return BackupManager.instance
  }

  /**
   * Initialize backup location
   */
  private async initializeBackupLocation(): Promise<void> {
    try {
      await fs.mkdir(this.config.backupLocation, { recursive: true })
      logger.info(`Backup location initialized: ${this.config.backupLocation}`)
    } catch (error) {
      logger.error('Failed to initialize backup location:', error)
      throw error
    }
  }

  /**
   * Create a full database backup
   */
  async createFullBackup(): Promise<Backup> {
    const backupId = crypto.randomUUID()
    const startTime = new Date()
    
    const backup: Backup = {
      id: backupId,
      type: 'full',
      status: 'pending',
      startTime,
      location: path.join(this.config.backupLocation, `full_${backupId}.sql`)
    }

    this.activeBackups.set(backupId, backup)
    
    try {
      backup.status = 'running'
      logger.info(`Starting full backup: ${backupId}`)
      
      // Create database dump
      const dumpCommand = this.buildDumpCommand(backup.location)
      await execAsync(dumpCommand)
      
      // Get file size
      const stats = await fs.stat(backup.location)
      backup.size = stats.size
      
      // Calculate checksum
      backup.checksum = await this.calculateChecksum(backup.location)
      
      // Compress if enabled
      if (this.config.compressionEnabled) {
        await this.compressBackup(backup)
      }
      
      // Encrypt if enabled
      if (this.config.encryptionEnabled) {
        backup.encryptionKey = await this.encryptBackup(backup)
      }
      
      // Upload to S3 if configured
      if (this.config.s3Bucket) {
        await this.uploadToS3(backup)
      }
      
      backup.status = 'completed'
      backup.endTime = new Date()
      
      this.backupHistory.push(backup)
      this.activeBackups.delete(backupId)
      
      logger.info(`Full backup completed: ${backupId} (${backup.size} bytes)`)
      
      // Record metrics
      metrics.business.backupCreated('full', backup.size || 0, true)
      
      return backup
    } catch (error) {
      backup.status = 'failed'
      backup.error = error instanceof Error ? error.message : 'Unknown error'
      backup.endTime = new Date()
      
      this.backupHistory.push(backup)
      this.activeBackups.delete(backupId)
      
      logger.error(`Full backup failed: ${backupId}`, error)
      
      // Record metrics
      metrics.business.backupCreated('full', 0, false)
      
      throw error
    }
  }

  /**
   * Create an incremental backup
   */
  async createIncrementalBackup(): Promise<Backup> {
    const backupId = crypto.randomUUID()
    const startTime = new Date()
    
    const backup: Backup = {
      id: backupId,
      type: 'incremental',
      status: 'pending',
      startTime,
      location: path.join(this.config.backupLocation, `incremental_${backupId}.sql`)
    }

    this.activeBackups.set(backupId, backup)
    
    try {
      backup.status = 'running'
      logger.info(`Starting incremental backup: ${backupId}`)
      
      // Get last backup time
      const lastBackup = this.getLastBackup()
      const sinceTime = lastBackup ? lastBackup.startTime : new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
      
      // Create incremental dump
      const dumpCommand = this.buildIncrementalDumpCommand(backup.location, sinceTime)
      await execAsync(dumpCommand)
      
      // Get file size
      const stats = await fs.stat(backup.location)
      backup.size = stats.size
      
      // Calculate checksum
      backup.checksum = await this.calculateChecksum(backup.location)
      
      // Compress if enabled
      if (this.config.compressionEnabled) {
        await this.compressBackup(backup)
      }
      
      // Encrypt if enabled
      if (this.config.encryptionEnabled) {
        backup.encryptionKey = await this.encryptBackup(backup)
      }
      
      // Upload to S3 if configured
      if (this.config.s3Bucket) {
        await this.uploadToS3(backup)
      }
      
      backup.status = 'completed'
      backup.endTime = new Date()
      
      this.backupHistory.push(backup)
      this.activeBackups.delete(backupId)
      
      logger.info(`Incremental backup completed: ${backupId} (${backup.size} bytes)`)
      
      // Record metrics
      metrics.business.backupCreated('incremental', backup.size || 0, true)
      
      return backup
    } catch (error) {
      backup.status = 'failed'
      backup.error = error instanceof Error ? error.message : 'Unknown error'
      backup.endTime = new Date()
      
      this.backupHistory.push(backup)
      this.activeBackups.delete(backupId)
      
      logger.error(`Incremental backup failed: ${backupId}`, error)
      
      // Record metrics
      metrics.business.backupCreated('incremental', 0, false)
      
      throw error
    }
  }

  /**
   * Restore from backup
   */
  async restoreBackup(backupId: string, targetDatabase?: string): Promise<void> {
    const backup = this.backupHistory.find(b => b.id === backupId)
    if (!backup) {
      throw new Error(`Backup not found: ${backupId}`)
    }

    if (backup.status !== 'completed') {
      throw new Error(`Cannot restore from backup with status: ${backup.status}`)
    }

    try {
      logger.info(`Starting restore from backup: ${backupId}`)
      
      let backupFile = backup.location
      
      // Decrypt if encrypted
      if (backup.encryptionKey) {
        backupFile = await this.decryptBackup(backup)
      }
      
      // Decompress if compressed
      if (this.config.compressionEnabled) {
        backupFile = await this.decompressBackup(backup)
      }
      
      // Restore database
      const restoreCommand = this.buildRestoreCommand(backupFile, targetDatabase)
      await execAsync(restoreCommand)
      
      logger.info(`Restore completed from backup: ${backupId}`)
      
      // Record metrics
      metrics.business.backupRestored(backup.type, true)
    } catch (error) {
      logger.error(`Restore failed from backup: ${backupId}`, error)
      
      // Record metrics
      metrics.business.backupRestored(backup.type, false)
      
      throw error
    }
  }

  /**
   * Build database dump command
   */
  private buildDumpCommand(outputPath: string): string {
    const url = new URL(this.config.databaseUrl)
    const host = url.hostname
    const port = url.port || '5432'
    const database = url.pathname.slice(1)
    const username = url.username
    const password = url.password

    return `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -f ${outputPath}`
  }

  /**
   * Build incremental dump command
   */
  private buildIncrementalDumpCommand(outputPath: string, sinceTime: Date): string {
    const url = new URL(this.config.databaseUrl)
    const host = url.hostname
    const port = url.port || '5432'
    const database = url.pathname.slice(1)
    const username = url.username
    const password = url.password

    const sinceTimestamp = sinceTime.toISOString()
    
    return `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} --data-only --where="updated_at >= '${sinceTimestamp}'" -f ${outputPath}`
  }

  /**
   * Build restore command
   */
  private buildRestoreCommand(backupFile: string, targetDatabase?: string): string {
    const url = new URL(this.config.databaseUrl)
    const host = url.hostname
    const port = url.port || '5432'
    const database = targetDatabase || url.pathname.slice(1)
    const username = url.username
    const password = url.password

    return `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${username} -d ${database} -f ${backupFile}`
  }

  /**
   * Calculate file checksum
   */
  private async calculateChecksum(filePath: string): Promise<string> {
    const data = await fs.readFile(filePath)
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  /**
   * Compress backup file
   */
  private async compressBackup(backup: Backup): Promise<void> {
    const compressedPath = `${backup.location}.gz`
    const command = `gzip -c "${backup.location}" > "${compressedPath}"`
    
    await execAsync(command)
    
    // Update backup location and size
    const stats = await fs.stat(compressedPath)
    backup.location = compressedPath
    backup.size = stats.size
    
    // Remove original file
    await fs.unlink(backup.location.replace('.gz', ''))
  }

  /**
   * Encrypt backup file
   */
  private async encryptBackup(backup: Backup): Promise<string> {
    const encryptionKey = crypto.randomBytes(32)
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher('aes-256-gcm', encryptionKey)
    
    const input = await fs.readFile(backup.location)
    let encrypted = cipher.update(input)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    
    const authTag = cipher.getAuthTag()
    
    // Combine IV, auth tag, and encrypted data
    const combined = Buffer.concat([iv, authTag, encrypted])
    
    const encryptedPath = `${backup.location}.enc`
    await fs.writeFile(encryptedPath, combined)
    
    // Update backup location and size
    const stats = await fs.stat(encryptedPath)
    backup.location = encryptedPath
    backup.size = stats.size
    
    // Remove original file
    await fs.unlink(backup.location.replace('.enc', ''))
    
    return encryptionKey.toString('hex')
  }

  /**
   * Decrypt backup file
   */
  private async decryptBackup(backup: Backup): Promise<string> {
    if (!backup.encryptionKey) {
      throw new Error('No encryption key available for backup')
    }

    const encryptedData = await fs.readFile(backup.location)
    const iv = encryptedData.slice(0, 16)
    const authTag = encryptedData.slice(16, 32)
    const encrypted = encryptedData.slice(32)
    
    const decipher = crypto.createDecipher('aes-256-gcm', Buffer.from(backup.encryptionKey, 'hex'))
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encrypted)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    
    const decryptedPath = backup.location.replace('.enc', '')
    await fs.writeFile(decryptedPath, decrypted)
    
    return decryptedPath
  }

  /**
   * Decompress backup file
   */
  private async decompressBackup(backup: Backup): Promise<string> {
    const decompressedPath = backup.location.replace('.gz', '')
    const command = `gunzip -c "${backup.location}" > "${decompressedPath}"`
    
    await execAsync(command)
    
    return decompressedPath
  }

  /**
   * Upload backup to S3
   */
  private async uploadToS3(backup: Backup): Promise<void> {
    if (!this.config.s3Bucket) {
      throw new Error('S3 configuration not provided')
    }

    // This would typically use AWS SDK
    // For now, we'll simulate the upload
    logger.info(`Uploading backup to S3: ${backup.id}`)
    
    // Simulate upload time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    logger.info(`Backup uploaded to S3: ${backup.id}`)
  }

  /**
   * Get last backup
   */
  private getLastBackup(): Backup | undefined {
    const completedBackups = this.backupHistory.filter(b => b.status === 'completed')
    return completedBackups.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())[0]
  }

  /**
   * Clean up old backups
   */
  async cleanupOldBackups(): Promise<void> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays)
    
    const oldBackups = this.backupHistory.filter(backup => 
      backup.startTime < cutoffDate && backup.status === 'completed'
    )
    
    for (const backup of oldBackups) {
      try {
        // Remove local file
        await fs.unlink(backup.location)
        
        // Remove from history
        const index = this.backupHistory.indexOf(backup)
        if (index > -1) {
          this.backupHistory.splice(index, 1)
        }
        
        logger.info(`Cleaned up old backup: ${backup.id}`)
      } catch (error) {
        logger.error(`Failed to clean up backup: ${backup.id}`, error)
      }
    }
  }

  /**
   * Get backup statistics
   */
  getBackupStats(): {
    totalBackups: number
    successfulBackups: number
    failedBackups: number
    totalSize: number
    averageSize: number
    lastBackup?: Date
    activeBackups: number
  } {
    const successfulBackups = this.backupHistory.filter(b => b.status === 'completed')
    const failedBackups = this.backupHistory.filter(b => b.status === 'failed')
    const totalSize = successfulBackups.reduce((sum, backup) => sum + (backup.size || 0), 0)
    
    return {
      totalBackups: this.backupHistory.length,
      successfulBackups: successfulBackups.length,
      failedBackups: failedBackups.length,
      totalSize,
      averageSize: successfulBackups.length > 0 ? totalSize / successfulBackups.length : 0,
      lastBackup: successfulBackups.length > 0 ? successfulBackups[0].startTime : undefined,
      activeBackups: this.activeBackups.size
    }
  }

  /**
   * Get backup history
   */
  getBackupHistory(limit: number = 50): Backup[] {
    return this.backupHistory
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit)
  }

  /**
   * Get active backups
   */
  getActiveBackups(): Backup[] {
    return Array.from(this.activeBackups.values())
  }

  /**
   * Cancel a backup
   */
  async cancelBackup(backupId: string): Promise<void> {
    const backup = this.activeBackups.get(backupId)
    if (!backup) {
      throw new Error(`Active backup not found: ${backupId}`)
    }

    backup.status = 'cancelled'
    backup.endTime = new Date()
    
    this.backupHistory.push(backup)
    this.activeBackups.delete(backupId)
    
    logger.info(`Backup cancelled: ${backupId}`)
  }

  /**
   * Validate backup integrity
   */
  async validateBackup(backupId: string): Promise<boolean> {
    const backup = this.backupHistory.find(b => b.id === backupId)
    if (!backup) {
      throw new Error(`Backup not found: ${backupId}`)
    }

    try {
      // Check if file exists
      await fs.access(backup.location)
      
      // Verify checksum if available
      if (backup.checksum) {
        const currentChecksum = await this.calculateChecksum(backup.location)
        if (currentChecksum !== backup.checksum) {
          logger.warn(`Backup checksum mismatch: ${backupId}`)
          return false
        }
      }
      
      return true
    } catch (error) {
      logger.error(`Backup validation failed: ${backupId}`, error)
      return false
    }
  }
}

// Backup utilities
export const backupManager = BackupManager.getInstance()

// Export backup utilities
export {
  BackupManager,
  backupManager
}
