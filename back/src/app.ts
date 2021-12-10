import 'reflect-metadata'
import express from 'express'
import { environment, isDevelopment } from './environment'
import { getRouteInfo, InversifyExpressServer } from 'inversify-express-utils'
import { container } from './di/inversify.config'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
import prettyjson from 'prettyjson'
import winston, { logger } from './logging/winston'

import { createConnection } from 'typeorm'

import './v1/controllers/reservation.controller'
import { Reservation } from './models/entities/reservation'



const start = async (): Promise<void> => {
  const PORT = environment.PORT

  await createConnection({
    type: 'postgres',
    database: environment.DB_NAME,
    username: environment.DB_USER,
    password: environment.DB_PASS,
    host: environment.DB_HOST,
    port: parseInt(environment.DB_PORT),
    entities: [
      Reservation
    ]
  })

  const server = new InversifyExpressServer(container as any)

  server.setConfig((app: express.Application) => {
    app.use(winston.infoLogging)
    app.use(helmet())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(cors())
    app.set('json spaces', 2)
    app.use(express.static('public'))
  })

  server.setErrorConfig((app: express.Application) => {
    // Handle errors, if any
    app.use((err, req, res, next) => {

      if (err) {

        // Just logging "err" here will not send anything to ES because err is circular (an error is smothered in winston-elastic)
        logger.error('Server error', { error: err.error })
        logger.error(JSON.stringify(err, null, 2))

        // Set the locals, provide the full error if we're in development
        res.locals.message = isDevelopment() ? 'Server error (showing in dev)' : 'Something went wrong.'
        res.locals.error = isDevelopment() ? err : 'Something went wrong.'

        // Send the error to the client
        res.status(500).json({
          errors: [
            isDevelopment() ?
              err.error :
              { message: 'Something went wrong.' }
          ]
        })
      }
    })
  })

  const app = server.build()

  // Print route info
  const routeInfo = getRouteInfo(container as any)
  console.log(prettyjson.render({ routes: routeInfo }))

  app.listen(PORT, () => {
    console.log(`Emily User Service listening on port ${PORT} (running as ${environment.NODE_ENV})`)
  })
}

start().catch(err => console.error(err))
