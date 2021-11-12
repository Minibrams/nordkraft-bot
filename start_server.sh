if [ ! $1 ]; then
  echo "Please provide the environment [development | production]"
  exit 1
fi;

npm run build
pm2-runtime processes.json --env $1