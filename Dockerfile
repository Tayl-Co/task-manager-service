FROM node:16.0-alpine

WORKDIR /usr/src/

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]