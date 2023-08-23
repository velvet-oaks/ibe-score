#!/bin/bash

docker network create backend \
&& \
docker network create web

docker compose -f  docker-compose.yml up