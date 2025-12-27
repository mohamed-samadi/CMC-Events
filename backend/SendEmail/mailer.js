require('dotenv').config();
const  express = require("express") ;

const nodemailer = require('nodemailer') ;


const app = express();
app.use(express.json());

// Gmail SMTP config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

module.exports = transporter;
