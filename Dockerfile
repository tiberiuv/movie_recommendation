FROM node:10-alpine

WORKDIR /usr/src/app

RUN npm install --global yarn

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 8088

RUN yarn run build

CMD [ "yarn", "serve" ]