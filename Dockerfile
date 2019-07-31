# build proxy files
FROM node:10.16-alpine AS build

RUN mkdir -p /app

WORKDIR /app

COPY package.json yarn.* ./
RUN yarn

COPY ./ ./
RUN yarn build

# proxy image
FROM nginx:1.17.1

ENV NODE_ENV=production
ENV DOCKER_SOCK=/app/docker.sock

RUN mkdir -p /app \
  && apt-get update \
  && apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
  && apt-get install -y nodejs certbot \
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && apt-get autoremove \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && openssl dhparam -out /etc/nginx/dhparam.pem 2048 \
  && rm -rf /etc/nginx/conf.d/default.conf

WORKDIR /app

# copy package.json and yarn files
COPY package.json yarn.* ./

# nginx files
COPY src/assets/nginx.conf /etc/nginx/nginx.conf

# install packages
RUN export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH" \
  && yarn global add pm2 \
  && yarn --prod

# copy project files
COPY src/ ./
COPY --from=build /app/dist/ ./

# mount volumes
VOLUME /app/docker.sock /etc/letsencrypt

ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
CMD ["pm2-runtime", "server.js"]
