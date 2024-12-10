// app/lib/ftp.ts
import { Client } from 'basic-ftp'
import { Readable } from 'stream'

interface FtpConfig {
  host: string
  user: string
  password: string
  port?: number
  secure?: boolean
  retries?: number
}

export class FtpClient {
  private config: FtpConfig

  constructor(config: FtpConfig) {
    this.config = {
      port: 21,
      secure: false,
      retries: 3,
      ...config
    }
  }

  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error
    for (let i = 0; i < (this.config.retries || 3); i++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        if (i < (this.config.retries || 3) - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
    }
    throw lastError!
  }

  async connect() {
    const client = new Client()
    client.ftp.verbose = process.env.NODE_ENV === 'development'
    
    try {
      await client.access({
        host: this.config.host,
        user: this.config.user,
        password: this.config.password,
        port: this.config.port,
        secure: this.config.secure
      })
      return client
    } catch (error) {
      console.error('FTP connection error:', error)
      throw error
    }
  }

  async ensureDir(remotePath: string) {
    const client = await this.connect()
    try {
      const parts = remotePath.split('/')
      let currentPath = ''
      
      for (const part of parts) {
        if (!part) continue
        currentPath += '/' + part
        try {
          await client.ensureDir(currentPath)
        } catch (error) {
          console.error(`Failed to create directory ${currentPath}:`, error)
        }
      }
    } finally {
      client.close()
    }
  }

  async uploadFromBuffer(buffer: Buffer, remotePath: string) {
    await this.ensureDir(remotePath.split('/').slice(0, -1).join('/'))
    
    return this.withRetry(async () => {
      const client = await this.connect()
      try {
        const readable = Readable.from(buffer)
        await client.uploadFrom(readable, remotePath)
      } finally {
        client.close()
      }
    })
  }

  async uploadFile(localPath: string, remotePath: string) {
    await this.ensureDir(remotePath.split('/').slice(0, -1).join('/'))
    
    return this.withRetry(async () => {
      const client = await this.connect()
      try {
        await client.uploadFrom(localPath, remotePath)
      } finally {
        client.close()
      }
    })
  }

  async deleteFile(remotePath: string) {
    return this.withRetry(async () => {
      const client = await this.connect()
      try {
        await client.remove(remotePath)
      } finally {
        client.close()
      }
    })
  }

  async downloadFile(remotePath: string, localPath: string) {
    return this.withRetry(async () => {
      const client = await this.connect()
      try {
        await client.downloadTo(localPath, remotePath)
      } finally {
        client.close()
      }
    })
  }
}