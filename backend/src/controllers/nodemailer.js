require('dotenv').config();
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
// const { promisify } = require('util');

async function readFileAsync(filePath, encoding) {
	try {
		const content = await fs.readFile(filePath, encoding);
		return content;
	} catch (err) {
		throw err;
	}
}
const smtp = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // use TLS

	auth: {
		user: process.env.SMTP_EMAIL,
		pass: process.env.SMTP_PASS
	}
};

async function sendNodeMail(contact) {
	console.log(contact)
	const transport = nodemailer.createTransport(smtp);
	const template = await readFileAsync(
		path.join(__dirname, '..', 'email', 'templates', 'basic_email.html'),
		'utf8'
	);
	try {
		console.log('email contact',contact);
		let mailOptions = {
			from: smtp.auth.user,
			to: contact.email,
			bcc: [process.env.NICOLE, process.env.IBE_ADMIN],
			subject: 'Welcome to International Bridge Excellence',
			html: template
				.replace('[full_name]', contact.full_name)
				.replace('[username]', contact.user_name)
				.replace('[slot]', contact.slot)
				.replace('[password]', contact.password)
		};
		const info = await transport.sendMail(mailOptions);
		return { messageId: info.messageId };
	} catch (err) {
		console.error(err);
		`An error occurred while attempting to send the mail. Error: ${err}`;
	}
}

async function sendNewPass(contact) {
	// test template

	try {
		const transport = nodemailer.createTransport(smtp);
		// const template = readFileAsync(
		// 	path.join(__dirname, '..', 'email', 'templates', 'sendPass.html'),
		// 	'utf8'
		// );

		const welcomeEmail = await readFileAsync(
			path.join(__dirname, '..', 'email', 'templates', 'basic_email.html'),
			'utf8'
		);
		if (welcomeEmail) {
			console.log('welcomeEmail: ', welcomeEmail);
		} else {
			console.log('No test_template');
		}
		// console.log('contact: ', contact);
		const mailOptions = {
			from: smtp.auth.user,
			to: contact.email,
			bcc: [process.env.NICOLE, process.env.IBE_ADMIN],
			subject: 'Welcome to IBEScore',
			// 	html: template
			// 		.replace('[full_name]', contact.recipientFullName)
			// 		.replace('[slot]', contact.recipientSlot)
			html: welcomeEmail
				.replace('{{email}}', contact.email)
				.replace('{{password}}', contact.newPassword)
				.replace('{{slot}}', contact.slot)
				.replace('{{username}}', contact.user_name)
		};
		try {
			const info = await transport.sendMail(mailOptions);
			if (info) {
				// console.log('Success sending mail', info.messageId);
				return { messageId: info.messageId };
			}
		} catch (err) {
			console.error(`Error sending mail`, err);
			throw err;
		}
	} catch (err) {
		console.error(
			`An error occurred while attempting to send the mail. Error: ${err}`
		);
		throw err;
	}
}

module.exports = { sendNodeMail, sendNewPass };
