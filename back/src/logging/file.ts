import winston, { format } from "winston";
import { lineFormat } from "./console";

const fileFormat = format.printf((info) => {
  if (info.stack) {
    return [info.stack, JSON.stringify(info.meta, null, 2)].join('\n')
  }
  return [lineFormat(info.timestamp, info.level, info.message), JSON.stringify(info.meta, null, 2)].join('\n')
})

export const fileTransport = new winston.transports.File({
  filename: 'app.log',
  maxsize: 5000000, // 5MB
  maxFiles: 5,
  format: winston.format.combine(
    winston.format.timestamp(),
    fileFormat
  ),
  level: 'debug'
})