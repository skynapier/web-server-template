import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { sendEmail } from './services/MailService';
import {MailType, MailRequest} from './types/MailType';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(bodyParser.json())

// Manually redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  next();
});


// Serve static files from the "./client" directory at the root URL ('/')
app.use(express.static(path.join(__dirname, './client')));

// Define a catch-all route that serves the "index.html" file for all other routes
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './client', 'index.html'));
});

app.post('/api/send-email', async (req, res) =>{
  console.log(req.body);
  const mailRequest = req.body as MailRequest;

  if (mailRequest.phone === null || mailRequest.email === null) {
    return res.status(400).json({ error: 'Email cannot be null' });
  }


  const createMailOptions = (mailRequest:MailRequest) => (
     `
      <h2>Contact Details:</h2>
      <p><strong>First Name:</strong> ${mailRequest.firstName}</p>
      <p><strong>Last Name:</strong> ${mailRequest.lastName}</p>
      <p><strong>Email:</strong> ${mailRequest.email}</p>
      <p><strong>Phone:</strong> ${mailRequest.phone || 'N/A'}</p>
  
      <h2>Message:</h2>
      <p>${mailRequest.note}</p>
  
      <p>Additional information or formatting can be added here.</p>
    `);

    // Define the email details
  const email: MailType = {
    from: '"BYDH WEB 👻" <bydh.nz@gmail.com>',
    to: 'info@bydh.co.nz',
    subject: `${mailRequest.firstName} ${mailRequest.lastName} contact BYDH via Website`,
    html: createMailOptions(mailRequest),
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