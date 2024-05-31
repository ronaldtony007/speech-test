FROM node:22-alpine3.19

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY ./build ./build

EXPOSE 3000

CMD [ "npm", "run", "prod"]