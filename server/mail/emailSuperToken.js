const nodemailer = require("nodemailer");
const mailgun = require("nodemailer-mailgun-transport");

const auth = {
  auth: {
    api_key: "5127de6fc0d69040413ff54e8ff9fb61-baa55c84-b8773820",
    domain: "sandboxbe120b520f884b84b850c0279cc18192.mailgun.org",
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
