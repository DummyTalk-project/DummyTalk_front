# Stage 1: Build
FROM node:20 as build
RUN mkdir /app
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Deploy
FROM nginx as deploy
RUN apt-get update && apt-get install -y vim
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
