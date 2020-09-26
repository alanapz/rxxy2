#!/bin/sh

set -e

# Rebuild docker
docker image build --no-cache --tag alanmpinder/rxxy2:1.0 build

# Push new version
docker image push alanmpinder/rxxy2:1.0
