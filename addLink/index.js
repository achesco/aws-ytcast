/**
 * Starts remote processing for youtube link, supports both
 * youtube.com/watch?v=VIDEO_ID and youtu.be/VIDEO_ID
 * link protocol (https) could be presented but not required
 * 
 * Reads following environment variables:
 * SSH_HOST - host to run processing script (~/scripts/download-call.sh)
 * SSH_USER - user to login
 * SSH_KEY - ssh key with newlines replaced with '\n'
 */

const url = require('url');
const SSH = require('simple-ssh');

function getUrl(link) {
	const { host, query, pathname } = url.parse(link, true);
	let id;
	if (host.endsWith('youtube.com') && pathname === '/watch') {
		id = query.v;
	} else if (host.endsWith('youtu.be')) {
		id = pathname.split('/')[1];
	}
	if (!id) {
		return false;
	}
	return `https://www.youtube.com/watch?v=${id}`;
}

exports.handler = async (update) => {
	try {
		const { SSH_HOST, SSH_USER, SSH_KEY } = process.env;
		const { message: { from: { username }, text: link } } = update;

		if (username !== 'achesco') {
			throw 'ERROR: Username is not achesco!';
		}

		const url = getUrl(link);
		if (!url) {
			throw 'ERROR: Message with link validation failed!';
		}

		const ssh = new SSH({
			host: SSH_HOST,
			user: SSH_USER,
			key: SSH_KEY.replace(/\\n\s?/g, "\n"),
		});

		const stdout = await new Promise((resolve, reject) => {
			ssh.exec('~/scripts/download-call.sh', {
				args: [`"${url}"`],
				out: resolve,
				err: reject,
			}).start();
		});

		console.log(stdout);

	} catch (error) {
		console.error(error);
	}

	return { statusCode: 200 };
};
