import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express()

app.use(express.static(path.join(__dirname, './client')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './client', 'index.html'));
});


const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})