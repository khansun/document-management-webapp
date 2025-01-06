FROM node:20.13 AS build

WORKDIR /app

COPY package.json yarn.lock tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY ./src ./src
COPY ./public ./public
RUN yarn install
RUN yarn build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
