// app/lib/ftp.ts
import { Client } from 'basic-ftp'

interface FtpConfig {
  host: string
  user: string
  password: string
  port?: number
  secure?: boolean
}

export class FtpClient {
  private config: FtpConfig

  constructor(config: FtpConfig) {
    this.config = {
      port: 21,
      secure: false,
      ...config
    }
  }

  async connect() {
    const client = new Client()
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

  async uploadFile(localPath: string, remotePath: string) {
    const client = await this.connect()
    try {
      await client.uploadFrom(localPath, remotePath)
    } finally {
      client.close()
    }
  }

  async downloadFile(remotePath: string, localPath: string) {
    const client = await this.connect()
    try {
      await client.downloadTo(localPath, remotePath)
    } finally {
      client.close()
    }
  }

  // Add deleteFile method
  async deleteFile(remotePath: string) {
    const client = await this.connect()
    try {
      await client.remove(remotePath)
    } finally {
      client.close()
    }
  }

  async uploadFromBuffer(buffer: Buffer, remotePath: string) {
    const client = await this.connect()
    try {
      await client.uploadFrom(buffer, remotePath)
    } finally {
      client.close()
    }
  }
}