const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async function (options) {
  console.log("inside the send mail function ++++++++++++");

  console.log(
    process.env.SMTP_HOST,
    process.env.SMTP_PORT,
    process.env.SMTP_EMAIL,
    process.env.SMTP_PASSWORD
  );
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  const message = {
    from: `${process.env.FROM_NAME}  <${process.env.FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
    // html: "<b>Hello world?</b>", // html body
  };
  console.log(
    "inside the send mail function ++++++++-------------------------++++"
  );

  const info = await transporter.sendMail(message);
  console.log(
    "inside the send mail function ++++++++-------------------------++++"
  );

  console.log("Message sent: %s", info.messageId);
};
// sendEmail().catch(console.error);

module.exports = sendEmail;
