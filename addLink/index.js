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

const SSH = require('simple-ssh');
const linkRe = /(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9\-_]+$/;

exports.handler = async (update) => {
	try {
		const { SSH_HOST, SSH_USER, SSH_KEY } = process.env;
		const { message: { from: { username }, text: link } } = update;

		if (username !== 'achesco') {
			throw 'ERROR: Username is not achesco!';
		}

		if (!linkRe.test(link)) {
			throw 'ERROR: Message with link validation failed!';
		}

		const ssh = new SSH({
			host: SSH_HOST,
			user: SSH_USER,
			key: SSH_KEY.replace(/\\n\s?/g, "\n"),
		});

		const stdout = await new Promise((resolve, reject) => {
			ssh.exec('~/scripts/download-call.sh', {
				args: [`"${link}"`],
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
