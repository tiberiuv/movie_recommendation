FROM node:10-alpine

WORKDIR /usr/src/app

RUN npm install --global yarn

COPY package*.json ./

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && yarn install \
    && apk del .gyp

COPY . .

EXPOSE 3000

RUN yarn run build

CMD [ "yarn", "serve" ]
