FROM node:20.12.2-bookworm

WORKDIR /usr/src/app

COPY package*.json ./


#RUN npm install

COPY . . 

EXPOSE 3000

CMD npm install & npm run test
