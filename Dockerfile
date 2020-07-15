FROM node:12 as builder
WORKDIR /app
COPY ./packages/bot/package*.json ./
RUN npm ci
COPY ./packages/bot/ ./
RUN npm run build

FROM node:12-alpine as app
WORKDIR /app
ENV NODE_ENV production
COPY ./packages/bot/package*.json ./
RUN npm ci
COPY --from=builder /app/lib ./lib
EXPOSE 3000
CMD [ "npm", "run", "start" ]
