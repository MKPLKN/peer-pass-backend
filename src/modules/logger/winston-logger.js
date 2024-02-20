const fs = require('fs')
const path = require('path')
const winston = require('winston')
const { format } = winston
const ILogger = require('./logger')

module.exports = class WinstonLogger extends ILogger {
  constructor () {
    super()

    this.dir = path.join(process.cwd(), 'logs')

    const simplifiedFormat = format.printf(({ level, message, timestamp }) => {
      return `${timestamp}: ${message} - ${level}`
    })

    this.logger = winston.createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          )
        }),
        new winston.transports.File({
          filename: this.filePath(
            this.getLogFileNames('combined')
          )
        }),
        new winston.transports.File({
          filename: this.filePath(
            this.getLogFileNames('simplified')
          ),
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            simplifiedFormat
          )
        })
      ]
    })
  }

  getLogFileNames (name) {
    const files = ['combined.log', 'simplified.log']
    return name ? files.find(n => n.replace('.log', '') === name) : files
  }

  filePath (path) {
    return `${this.dir}/${path}`
  }

  info (msg, trace) {
    this.logger.info(msg, { trace })
  }

  error (msg, trace) {
    this.logger.error(msg, { trace })
  }

  clear (name) {
    const logFiles = this.getLogFileNames()

    if (name) {
      const filePath = this.filePath(name)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        console.log(`Log file ${name} deleted.`)
      } else {
        console.log(`Log file ${name} not found.`)
      }
    } else {
      logFiles.forEach(file => {
        const filePath = this.filePath(file)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
          console.log(`Log file ${file} deleted.`)
        }
      })
    }
  }
}
