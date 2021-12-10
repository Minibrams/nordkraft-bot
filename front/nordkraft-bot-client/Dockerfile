FROM node:12

RUN mkdir -p /app
WORKDIR /app
COPY . .

RUN npm install
RUN npm install -g serve
RUN npm run build

CMD serve -s build