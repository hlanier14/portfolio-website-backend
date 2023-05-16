const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = parseInt(process.env.PORT) || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new SecretManagerServiceClient();

async function getSecretValue(secretName) {
    const [version] = await client.accessSecretVersion({
        name: secretName,
    });
    return version.payload.data.toString();
}

app.post('/contact-form-submission', async (req, res) => {

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('Missing required fields');
    }

    const fromEmail = await getSecretValue(process.env.FROM_EMAIL);
    const fromEmailPassword = await getSecretValue(process.env.FROM_EMAIL_PASSWORD);
    const toEmail = await getSecretValue(process.env.TO_EMAIL);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: fromEmail,
            pass: fromEmailPassword
        }
    });

    const emailContent = `
        Name: ${name}
        Email: ${email}
        Message: ${message}
    `;

    const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: 'Portfolio Website Contact Form Submission',
        text: emailContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
            res.status(500).send('Error occurred');
        } else {
            console.log('Email sent:', info.response);
            res.send('Email sent successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;