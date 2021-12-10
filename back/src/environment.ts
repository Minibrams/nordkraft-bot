import dotenv from 'dotenv'


export const environment = {
  NODE_ENV: '',
  PORT: '',
  SERVICE_NAME: '',
  DB_HOST: '',
  DB_PORT: '',
  DB_NAME: '',
  DB_USER: '',
  DB_PASS: '',
  NORDKRAFT_USERNAME: '',
  NORDKRAFT_PASSWORD: ''
}

/**
 * Loads the proper environment variables into the environment constant.
 * If running in development, the environment variables will be loaded
 * from the .env file.
 */
const loadEnvironment = (): void => {

  if (process.env.NODE_ENV === undefined) {
    console.error('Environment variable NODE_ENV not provided.')
    process.exit(1)
  }

  dotenv.config()  // Should probably only do this in dev, but oh well

  for (const [name, ] of Object.entries(environment)) {
    environment[name] = process.env[name]
    if (!environment[name]) {
      throw new Error(`Environment variable ${name} not provided.`)
    }
  }
}

loadEnvironment()
export const isDevelopment = (): boolean => environment.NODE_ENV === 'development'
export const isStaging = (): boolean => environment.NODE_ENV === 'staging'
export const isProduction = (): boolean => environment.NODE_ENV === 'production'
