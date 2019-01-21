FROM node:9-alpine

WORKDIR /usr/src/app

RUN npm install --global yarn

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 8080

RUN yarn run build

CMD [ "yarn", "start" ]