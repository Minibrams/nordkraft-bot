/**
 * This script should only be called by npm migration:generate, etc.
 * Do not call this script manually.
 * 
 * Loads the environment variables for database connection from .env into ormconfig.
 */

const keyValuePairs = {
  database: 'DB_NAME',
  username: 'DB_USER',
  password: 'DB_PASS',
  host: 'DB_HOST',
  port: 'DB_PORT'
}

const loadOrmconfigBase = () => {
  return JSON.parse(require('fs').readFileSync('ormconfig.base.json').toString())
}

const assignConnectionInfo = (base) => {
  for (const [key, value] of Object.entries(keyValuePairs)) {
    base[key] = process.env[value]
    if (!base[key]) {
      throw new Error(`MIGRATION ABORTED. Environment variable "${value}" is missing. Do you have your .env file?`)
    }
  }

  base.type = 'postgres'
  return base
}

const writeOrmconfig = (config) => {
  require('fs').writeFileSync('ormconfig.json', JSON.stringify(config, null, 2))
} 

if (require.main === module) {
  require('dotenv').config()
  const base = loadOrmconfigBase()
  const config = assignConnectionInfo(base)
  writeOrmconfig(config)
} 