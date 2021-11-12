/**
 * This script should only be called by npm migration:generate, etc.
 * Do not call this script manually.
 * 
 * Restores the base ormconfig.json as to not leak database credentials.
 */

const loadOrmconfigBase = () => {
  return JSON.parse(require('fs').readFileSync('ormconfig.base.json').toString())
}

const writeOrmconfig = (config) => {
  require('fs').writeFileSync('ormconfig.json', JSON.stringify(config, null, 2))
} 

if (require.main === module) {
  const base = loadOrmconfigBase()
  writeOrmconfig(base)
}