#!/bin/bash

URL=$1

echo "URL: ${URL}"

youtube-dl -f 140 $URL

/usr/bin/aws s3 cp *.m4a s3://${YTC_S3_BIN}/

echo "YTCast playlist updated!" | ~/scripts/telelog.sh
