# Proxy

The complete solution for create a automated proxy with nginx for docker containers inspired by docker image [jwilder/nginx-proxy](https://github.com/jwilder/nginx-proxy) e [jrcs/letsencrypt-nginx-proxy-companion](https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion).

## Features

> This project is under development, and not all features are ready, check out the roadmap below to know what I'm working on. If you want to help with this project, feel free to ask or submit a pull request.

### Roadmap

- [x] Automated create/update of nginx config when container is created/deleted.
- [ ] Automated create/renewal of Let's Encrypt certificates using certbot.
- [ ] Let's Encrypt / ACME domain validation through challenge.
- [ ] Extensible to create custom templates.
- [x] Multiple hosts.
- [x] IPV6 support.

## Usage

### 1. Create the proxy

First of all, you must create the proxy. With the command below, you create the proxy easily:

```bash
$ docker container run --name proxy -p 80:80 -v /var/run/docker.sock:/app/docker.sock:ro -d italoiz/proxy
```

_There is something very important happening here. You must pass the `-v /var/run/docker.sock:/app/docker.sock:ro` flag. This is what will allow node.js to listen for docker container creation events._

### 2. Be happy! Create your containers by passing environment variables:

```bash
$ docker container run --name example -e VIRTUAL_HOST=example.com -d nginx
```

> The proxy will direct traffic from the `example.com` domain to the automatically created container.

## License

MIT © [Italo Izaac](https://italoiz.com/)
