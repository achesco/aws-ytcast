## addLink

Lambda code. Add youtube link for processing.

Env vars:
* SSH_HOST - host to run processing script (~/scripts/download-call.sh)
* SSH_USER - user to login
* SSH_KEY - ssh key with newlines replaced with '\n'

## getPlaylist

Lambda code. Get playlist.

Env vars:
* S3_BUCKET - s3 bucket identifier
* S3_BUCKET_URL - s3 bucket base url, should be accessible by consumers
* FEED_URL - url of playlist itself, should be accessible by consumers
* FEED_TITLE - title string

## workerImage

Docker image for ECS. Consists of following components.

Env vars:
* scripts/
	* telelog.sh - Log to telegram chat-bot. Env vars:
		* YTC_TG_CHAT_ID - chat id
		* YTC_TG_BOT_ID - bot id
		* YTC_TG_SECRET - bot auth token
	* download-call.sh (download.sh) - Run media download. Env vars:
		* YTC_S3_BIN - S3 bin name to save media

