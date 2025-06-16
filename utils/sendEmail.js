const sgMail = require('@sendgrid/mail');
const fs = require('fs');

require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail({ to, subject, text, attachments = [] }) {
  const preparedAttachments = attachments.map(file => {
    const fileContent = fs.readFileSync(file.path).toString('base64');
    return {
      content: fileContent,
      filename: file.filename,
      type: 'image/png',
      disposition: 'attachment'
    };
  });

  const msg = {
    to,
    from: process.env.SENDGRID_FROM || 'noreply@elanexpo.net',
    subject,
    text,
    attachments: preparedAttachments
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email error:', error.response ? error.response.body : error.message);
  }
}

module.exports = sendEmail;
