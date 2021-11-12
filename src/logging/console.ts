import winston, { format } from "winston"

export const lineFormat = (timestamp, level, message): string => `[${timestamp}] [${level.toUpperCase()}]: ${message} `
export const consoleFormat = format.printf(({ timestamp, level, message }) => lineFormat(timestamp, level, message))
export const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    consoleFormat
  ),
  level: 'debug'
})