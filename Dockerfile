ARG SENTRY_RELEASE
FROM node:12 as builder
WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:12 as app
ARG SENTRY_RELEASE
WORKDIR /app
COPY . ./
COPY --from=builder /app/lib ./lib
ENV NODE_ENV production
ENV SENTRY_RELEASE=$SENTRY_RELEASE
RUN npm ci
EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start" ]