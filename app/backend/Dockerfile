FROM node:16.15-alpine

WORKDIR /app-backend

COPY package* ./

RUN npm install

COPY . .

RUN npx tsc

EXPOSE 3001

CMD [ "npm", "start" ]