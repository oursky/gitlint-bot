FROM node:12 as builder
WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:12-alpine as app
WORKDIR /app
ENV NODE_ENV production
COPY ./package*.json ./
RUN npm ci
COPY --from=builder /app/lib ./lib
EXPOSE 3000
CMD [ "npm", "run", "start" ]
