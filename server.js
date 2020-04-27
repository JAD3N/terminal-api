const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const settings = require('./settings.json');

const transport = nodemailer.createTransport(settings.nodemailer);
const app = express();

function escape(s) {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => res.sendFile('./public/index.html'));
app.post('/contact', (req, res) => {
	const {
		name,
		email,
		phone,
		message,
	} = req.body;

	if(!name || !email || !message) {
		res.sendStatus(400);
	} else {
		const html = `
			<b>Name:</b> ${escape(name)}<br/>
			<b>Email:</b> ${escape(name)}<br/>
			${!!phone ?
				`<b>Phone:</b> ${escape(name)}<br/>`
			: ''}
			<b>Message:</b> ${escape(name)}<br/>
		`;

		const mailOptions = {
			to: settings.email,
			subject: settings.subject,
			from: settings.from,
			html,
		};

		transport.sendMail(mailOptions, (err) => {
			if(err) {
				console.error("Failed to send email:", err);
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}
		});
	}
});

app.listen(3000, (err) => {
	if(err) {
		console.err("Server error:", err);
	} else {
		console.info("Listening on port 3000");
	}
});