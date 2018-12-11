#!/bin/bash

docker build -t achesco/ytc:latest .
docker image prune
docker push achesco/ytc:latest
