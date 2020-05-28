const nodemailer = require("nodemailer");
const mailgun = require("nodemailer-mailgun-transport");

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const emailToken = async (token) => {
  const transport = nodemailer.createTransport(mailgun(auth));

  try {
    const info = await transport.sendMail({
      from: '"Authorization" <shaqdulove@gmail.com>',
      to: "shaqdulove@hotmail.com",
      subject: "Super Admin Token",
      text: token,
    });
    return info;
  } catch (e) {
    console.log(e);
    return new Error(e);
  }
};

module.exports = emailToken;
