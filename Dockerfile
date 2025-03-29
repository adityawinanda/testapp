FROM node:alpine3.20

WORKDIR /myapp

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8787

CMD ["npm", "run", "start:dev"]
