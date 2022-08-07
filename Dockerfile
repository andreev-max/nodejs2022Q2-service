FROM node:lts-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run prisma:generate