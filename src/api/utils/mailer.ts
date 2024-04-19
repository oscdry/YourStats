import fs from 'fs';
import nodemailer from 'nodemailer';
import Pino from '../../logger.js';

const passwordResetTemplate = 'mail-templates/password-reset.html';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	port: 465,
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD
	}
});

const sendEmail = async (email: string, subject: string, payload: string): Promise<void> => {

	const source = fs.readFileSync(passwordResetTemplate, 'utf8');
	const template = source.replace('%url%', payload);
	const options = {
		from: process.env.FROM_EMAIL,
		to: email,
		subject: subject,
		html: template
	};

	Pino.debug('Sending email to ' + email);

	// Send email
	transporter.sendMail(options, (error, info) => {
		if (error) {
			return error;
		} else {
			true;
		}
	});
};

export default sendEmail;

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/
