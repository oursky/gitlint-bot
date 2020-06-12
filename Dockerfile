FROM node:12 as builder
WORKDIR /app
COPY ./package*.json ./
RUN npm install

FROM node:12 as app
WORKDIR /app
COPY --from=builder /app/node_modules/ ./node_modules
COPY . ./
COPY .env ./
ENV NODE_ENV production
RUN npm run build
EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start" ]