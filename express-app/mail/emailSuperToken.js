const nodemailer = require("nodemailer");
const mailgun = require("nodemailer-mailgun-transport");

const auth = {
  auth: {
    api_key: "4f6a426e8038726d232e348211a6fd31-7fba8a4e-7928d558",
    domain: "sandbox761fe135f5e9458786fd394a1b3154eb.mailgun.org",
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
