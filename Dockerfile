FROM node:10-alpine

WORKDIR /usr/src/app

RUN npm install --global yarn

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3000

RUN yarn run build

CMD [ "yarn", "start" ]
