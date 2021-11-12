export $(cat .env | xargs) > /dev/null 2>&1

set -e

if [ ! $1 ]; then
  echo "Please provide a migration name"
  exit 1 
fi;

OLD_DB_HOST=$DB_HOST

# Make sure the database is running
echo "Ensuring that the database is running..."
sudo docker-compose -f docker-compose.yml --env-file .env up -d nordkraft-bot-db

# Replace the DB host with localhost so we can run the migrations locally
echo "Replacing $OLD_DB_HOST with localhost temporarily..."
sed -i'.bak' -e 's/DB_HOST='$OLD_DB_HOST'/DB_HOST=localhost/' .env

# Generate the migration script
echo "Generating the migration..."
npm run migration:generate $1

# Run the migration
echo "Running the migration..."
npm run migration:run

# Reset the .env file
echo "Restoring old DB host to $DB_HOST..."
sed -i'.bak' -e 's/DB_HOST=localhost/DB_HOST='$OLD_DB_HOST'/' .env

echo "Done!"
