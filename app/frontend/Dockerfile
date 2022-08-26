FROM node:16.15-alpine

WORKDIR /app-frontend

COPY package* ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]