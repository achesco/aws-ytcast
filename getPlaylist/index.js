/**
 * Returns playlist built by listing s3 bucket (media) files.
 * For now returns feed in XML-format because of JSON-Feed 
 * standard lack of support by popular podcast players.
 * 
 * Reads following environment variables:
 * S3_BUCKET - s3 bucket identifier
 * S3_BUCKET_URL - s3 bucket base url, should be accessible by consumers
 * FEED_URL - url of playlist itself, should be accessible by consumers
 * FEED_TITLE - title string
 * FEED_COVER_URL - url for cover image
 */

const AWS = require('aws-sdk');
const S3 = new AWS.S3({apiVersion: '2006-03-01'});

exports.handler = async (event) => {
	try {
		const { S3_BUCKET, S3_BUCKET_URL, FEED_URL, FEED_TITLE, FEED_COVER_URL } = process.env;
		const BucketUrl = S3_BUCKET_URL.replace(/\/$/, '') + '/';
		const list = await S3.listObjects({ Bucket: S3_BUCKET }).promise();

		const feed = {
			version: 'https://jsonfeed.org/version/1',
			title: FEED_TITLE,
			feed_url: FEED_URL,
			cover_url: FEED_COVER_URL,
		};
	
		feed.items = list.Contents
			.sort((a, b) => {
				if (a.LastModified === b.LastModified) {
					return 0;
				}
				if (a.LastModified < b.LastModified) {
					return 1;
				}
				return -1;
			})
			.map(file => ({
				id: file.Key,
				content_text: file.Key,
				url: `${BucketUrl}${encodeURIComponent(file.Key)}`,
				date_published: (new Date(file.LastModified)).toUTCString(),
				attachments: [{
					url: `${BucketUrl}${encodeURIComponent(file.Key)}`,
					size_in_bytes: file.Size,
					mime_type: 'audio/mpeg',
				}],
			}));

		// Till Downcast 3 (with JSON-Feed support)
		// should be compiled to XML :(
		const xml = toXml(feed);
		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'application/json',
			},
			// body: JSON.stringify(feed),
			body: xml,
		}

	} catch (error) {
		console.error(error);
	}

	return { statusCode: 200 };
};

function toXml(feed) {
	let xml = '<?xml version="1.0" encoding="UTF-8"?>';
	xml += '<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">';
	xml += '<channel>';
	xml += `<title>${feed.title}</title>`
	xml += `<link>${feed.feed_url}</link>`;
	xml += `<description>${feed.title}</description>`;
	xml += `<itunes:image href="${feed.cover_url}"/>`;
	for (const item of feed.items) {
		xml += '<item>';
		xml += `<title>${item.content_text}</title>`;
		xml += `<link>${item.url}</link>`;
		xml += `<description>${item.content_text}</description>`;
		xml += `<pubDate>${item.date_published}</pubDate>`;
		xml += `<guid>${item.id}</guid>`;
		xml += `<enclosure url="${item.attachments[0].url}" type="${item.attachments[0].mime_type}" length="${item.attachments[0].size_in_bytes}"></enclosure>`;
		xml += '</item>';
	}
	xml += '</channel>';
	xml += '</rss>';
	return xml;
}
