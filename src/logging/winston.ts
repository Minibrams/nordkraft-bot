import winston, { format } from 'winston'
import expressWinston from 'express-winston'
import { consoleTransport } from './console'
import { fileTransport } from './file'

expressWinston.responseWhitelist.push('body')
expressWinston.requestWhitelist.push('ip')

const transports: winston.transport[] = [
  consoleTransport,
  fileTransport,
]

// Ugly workaround to log errors (if any) are sent back to the user
// Note that these are errors such as "password too short" and such, not exceptions.
const logResponseErrors = (res: any, propName: string): any => {
  if (propName === 'body') return undefined
  return res[propName]
}

const infoLogging = expressWinston.logger({
  transports,
  meta: true,
  msg: '{{req.timestamp}} {{req.method}} {{req.originalUrl}} from {{req.ip}} (took {{res.responseTime}}ms) --> {{res.statusCode}} [{{JSON.stringify(res.body)}}] (filtered)',
  colorize: false,
  responseFilter: logResponseErrors
})

const errorLogging = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: 'app.log',
      maxsize: 5000000, // 5MB
      maxFiles: 5
    }),
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint()
  )
})

// Instantiate logger
export const logger = winston.createLogger({
  transports, exitOnError: false
})

export default {
  infoLogging, errorLogging
}
