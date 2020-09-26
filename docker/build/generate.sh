#!/bin/sh

set -e

apk add --no-cache bash git npm nodejs

mkdir -p /app/rxxy2 && cd /app/rxxy2
git clone --depth 1 https://github.com/alanapz/rxxy2.git /app/rxxy2

cd /app/rxxy2/rxxy2

# Disable NPM "send data to google" option
export NG_CLI_ANALYTICS=ci

npm install -g @angular/cli@10.0.4 typescript@3.9.5
npm install
