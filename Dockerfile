FROM node:12 as builder
WORKDIR /app/packages/bot
COPY ./packages/bot/package*.json ./
RUN npm ci
COPY ./packages/bot/ ./
COPY ./tsconfig.json ../../
RUN npm run build:prod

FROM node:12-alpine as app
WORKDIR /app
ENV NODE_ENV production
COPY ./packages/bot/package*.json ./
RUN npm ci
COPY --from=builder /app/packages/bot/lib ./lib
EXPOSE 3000
CMD [ "npm", "run", "start" ]
