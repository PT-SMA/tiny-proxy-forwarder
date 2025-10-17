# Proxy Forwarder

## Getting Started

Install the project

```bash
$ pnpm install
```

Setup proxy rules by duplicate and modify the `proxy.config.example.json` file.

```bash
$ cp proxy.config.example.json proxy.config.json
```


Start your service

```bash
$ pnpm start
```

## Rule Schema

```json
[
  {
    "source": "/my_path/:env/api",
    "target": {
      "prod": "http://your_custom_url",
      "dev": "http://your_custom_url"
    },
    "rewrite": "^/my_path/(prod|dev)/api"
  },
  
  ...
]
```

## Build Docker

```bash
$ docker build -t pt-sma/local-oracle-proxy:latest .
```