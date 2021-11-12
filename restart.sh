
touch app.log

docker-compose -f docker-compose.yml --env-file ./.env build $@
docker-compose -f docker-compose.yml --env-file ./.env down $@
docker-compose -f docker-compose.yml --env-file ./.env up $@
