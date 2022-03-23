FROM node:12-alpine

RUN apk add --no-cache tini

RUN mkdir -p /home/app

WORKDIR /home/app

COPY ./src/package*.json .

RUN npm install --production

COPY ./src/* .

RUN npm install -g nodemon

# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["nodemon", "server.js"]