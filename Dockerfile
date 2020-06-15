FROM node:12 as builder
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:12 as app
WORKDIR /app
COPY --from=builder /app/node_modules/ ./node_modules
COPY --from=builder /app/lib ./lib
COPY .env ./
ENV NODE_ENV production
EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start" ]