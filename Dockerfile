FROM node:10.16-alpine AS building

RUN mkdir -p /app

WORKDIR /app

COPY package.json yarn.* ./
RUN yarn

COPY ./ ./
RUN yarn build

FROM nginx:1.17.1

ENV NODE_ENV=production
ENV DOCKER_SOCK=/app/docker.sock

RUN apt-get update \
  && apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
  && apt-get install -y nodejs \
  && apt-get clean

RUN mkdir -p /app \
  && npm install -g pm2

WORKDIR /app
COPY ./src/ ./
COPY --from=building /app/dist/ ./

COPY package.json yarn.* ./
RUN npm install --prod

VOLUME /app/docker.sock

ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
CMD ["pm2-runtime", "server.js"]
