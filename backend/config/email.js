const nodemailer = require("nodemailer");
require("dotenv").config();

// const sendEmail = async (options) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "sandbox.smtp.mailtrap.io",
//       port: 587,
//       auth: {
//         user: process.env.MAILTRAP_USER,
//         pass: process.env.MAILTRAP_PASS,
//       },
//     });

//     const mailOptions = {
//       from: '"ChatApp Support" <support@chatapp.com>',
//       to: options.email, // Receiver's email
//       subject: options.subject,
//       text: options.message || '',
//       html: options.messageHTML
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_EMAIL_PASSKEY
    }
  });

  var mailOptions = {
    from: '"ChatApp Support" <support@chatapp.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


module.exports = sendEmail;
