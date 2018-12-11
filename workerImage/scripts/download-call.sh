#!/bin/bash

URL=$1
DIR=`uuidgen`

cd ~/tmp
mkdir $DIR
cd $DIR

nohup ~/scripts/download.sh "${URL}" > ~/logs/$DIR.log 2>&1 &