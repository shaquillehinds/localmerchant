const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = (token) => {
  return {
    to: "shaqdulove@hotmail.com",
    from: "shaqdulove@gmail.com",
    subject: "Authorization",
    text: `Here is your token:
    ${token}`,
  };
};

const sendEmail = async (token) => {
  try {
    await sgMail.send(msg(token));
  } catch (e) {
    console.error(e);
    if (e.response) {
      console.error(e.response.body);
    }
  }
};

module.exports = sendEmail;
