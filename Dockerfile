FROM node:11.1-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn global add @vue/cli
RUN yarn install
COPY . .