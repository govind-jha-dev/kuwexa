const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter = null;

if (env.mail.host && env.mail.user && env.mail.password) {
  transporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.secure,
    auth: {
      user: env.mail.user,
      pass: env.mail.password
    }
  });
}

async function sendMail(options) {
  if (!transporter) {
    return false;
  }

  await transporter.sendMail({
    from: env.mail.from,
    ...options
  });

  return true;
}

async function sendLeadAlert(lead) {
  return sendMail({
    to: env.mail.alertEmail,
    subject: `New lead from ${lead.name}`,
    text: [
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone || 'N/A'}`,
      `Source: ${lead.source || 'Website'}`,
      '',
      lead.message
    ].join('\n')
  });
}

async function sendApplicationAlert(application, jobTitle) {
  return sendMail({
    to: env.mail.alertEmail,
    subject: `New application for ${jobTitle}`,
    text: [
      `Name: ${application.name}`,
      `Email: ${application.email}`,
      `Phone: ${application.phone || 'N/A'}`,
      `Job: ${jobTitle}`,
      `Resume: ${application.resume}`,
      '',
      application.cover_letter || ''
    ].join('\n')
  });
}

async function sendChatAlert(chat, manager) {
  if (!manager?.email) {
    return false;
  }

  return sendMail({
    to: manager.email,
    subject: `New chat inquiry from ${chat.name}`,
    text: [
      `Assigned Manager: ${manager.name || manager.email}`,
      `Name: ${chat.name}`,
      `Email: ${chat.email}`,
      `Phone: ${chat.phone || 'N/A'}`,
      `Topic: ${chat.topic || 'General Inquiry'}`,
      `Page: ${chat.page_path || '/'}`,
      '',
      chat.message
    ].join('\n')
  });
}

module.exports = {
  sendLeadAlert,
  sendApplicationAlert,
  sendChatAlert
};
