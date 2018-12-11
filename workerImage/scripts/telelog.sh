#!/bin/bash

LOG=`cat <&0`

curl -H "Content-Type: application/json" \
	-X POST -d "{\"chat_id\":${YTC_TG_CHAT_ID},\"text\":\"$LOG\"}" \
	"https://api.telegram.org/${YTC_TG_BOT_ID}:${YTC_TG_SECRET}/sendMessage"