FROM node:12 as builder
WORKDIR /app
COPY ./package*.json ./
COPY ./lerna.json ./
COPY ./packages/bot/package*.json ./packages/bot/
COPY ./packages/lint/package*.json ./packages/lint/
RUN npm ci
RUN npm run bootstrap
COPY ./packages/bot/ ./packages/bot/
COPY ./packages/lint/ ./packages/lint
COPY ./tsconfig.json ./
RUN npm run build

FROM node:12-alpine as dependencies
WORKDIR /app
COPY ./package*.json ./
COPY ./lerna.json ./
COPY ./packages/bot/package*.json ./packages/bot/
COPY ./packages/lint/package*.json ./packages/lint/
RUN npm ci
RUN npm run bootstrap:prod

FROM node:12-alpine as app
WORKDIR /app/packages/bot
ENV NODE_ENV production
COPY ./packages/bot/package.json ./
COPY --from=dependencies /app/packages/bot/node_modules ./node_modules/
COPY --from=builder /app/packages/bot/lib ./lib/
EXPOSE 3000
CMD [ "npm", "run", "start" ]
