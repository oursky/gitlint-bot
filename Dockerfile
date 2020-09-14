FROM node:12 as builder
WORKDIR /app
COPY package*.json lerna.json ./
COPY packages/bot/package*.json ./packages/bot/
COPY packages/lint/package*.json ./packages/lint/
RUN npm ci && npm run bootstrap
COPY ./packages/bot ./packages/bot
COPY ./packages/lint ./packages/lint
COPY ./tsconfig.json ./
RUN npm run build:prod

FROM node:12-alpine as app
WORKDIR /app
COPY package*.json lerna.json ./
COPY packages/bot/package*.json ./packages/bot/
COPY packages/lint/package*.json ./packages/lint/
ENV NODE_ENV production
RUN npx lerna bootstrap
COPY /app/packages/bot ./packages/bot
COPY --from=builder /app/packages/bot/lib ./packages/bot/lib
COPY --from=builder /app/packages/lint/lib ./packages/lint/lib
EXPOSE 3000
WORKDIR /app/packages/bot
CMD [ "npm", "run", "start" ]
