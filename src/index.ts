import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { sendEmail } from './services/MailService';
import MailType from './types/MailType';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, './client')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './client', 'index.html'));
});

app.post('/api/send-email', async (req, res) =>{
  console.log(req.body);
  const { subject, text } = req.body;

  if (!subject || !text) {
    return res.status(400).json({ error: 'Subject and text are required.' });
  }

    // Define the email details
  const email: MailType = {
    from: '"BYDH WEB 👻" <bydh.nz@gmail.com>',
    to: 'info@bydh.co.nz',
    subject: subject,
    text: text,
    html: `<b>${text}</b>`,
  };

  try {
    // Send the email
    await sendEmail(email);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }

});

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})