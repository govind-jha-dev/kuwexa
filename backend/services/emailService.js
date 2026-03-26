const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter = null;

if (env.mail.host && env.mail.user && env.mail.password) {
  transporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.secure,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    auth: {
      user: env.mail.user,
      pass: env.mail.password
    }
  });
}

async function sendMail(options) {
  if (!transporter || !options?.to) {
    if (!transporter) {
      console.warn('Email transport is not configured. Skipping outgoing mail.');
    }
    return false;
  }

  try {
    await transporter.sendMail({
      from: env.mail.from,
      replyTo: env.mail.replyTo || undefined,
      ...options
    });
  } catch (error) {
    console.error(`Email send failed for ${options.to}:`, error.message);
    return false;
  }

  return true;
}

async function sendLeadAlert(lead) {
  const selectedProducts = Array.isArray(lead?.selected_products) && lead.selected_products.length
    ? `Selected Products: ${lead.selected_products.join(', ')}`
    : null;

  return sendMail({
    to: env.mail.alertEmail,
    subject: `New lead from ${lead.name}`,
    text: [
      `Name: ${lead.name}`,
      `Company: ${lead.company_name || 'N/A'}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone || 'N/A'}`,
      `Source: ${lead.source || 'Website'}`,
      selectedProducts,
      '',
      lead.message
    ].filter(Boolean).join('\n')
  });
}

async function sendLeadConfirmation(lead) {
  if (!lead?.email) {
    return false;
  }

  return sendMail({
    to: lead.email,
    subject: 'We received your inquiry | Kuwexa',
    text: [
      `Hello ${lead.name || 'there'},`,
      '',
      'Thank you for contacting Kuwexa.',
      'Your inquiry has been received and routed to our team for review.',
      '',
      `Inquiry type: ${lead.source || 'Website Contact Form'}`,
      `Company: ${lead.company_name || 'Not provided'}`,
      `Submitted email: ${lead.email}`,
      `Phone: ${lead.phone || 'Not provided'}`,
      Array.isArray(lead?.selected_products) && lead.selected_products.length
        ? `Selected products: ${lead.selected_products.join(', ')}`
        : null,
      '',
      'Our team will review your message and get back to you as soon as possible.',
      '',
      'Regards,',
      'Kuwexa'
    ].filter(Boolean).join('\n')
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

async function sendChatConfirmation(chat) {
  if (!chat?.email) {
    return false;
  }

  return sendMail({
    to: chat.email,
    subject: 'We received your chat inquiry | Kuwexa',
    text: [
      `Hello ${chat.name || 'there'},`,
      '',
      'Thank you for reaching out to Kuwexa.',
      'Your chat inquiry has been delivered to the designated manager.',
      '',
      `Topic: ${chat.topic || 'General Inquiry'}`,
      `Page: ${chat.page_path || '/'}`,
      `Submitted email: ${chat.email}`,
      `Phone: ${chat.phone || 'Not provided'}`,
      '',
      'We will follow up with you shortly.',
      '',
      'Regards,',
      'Kuwexa'
    ].join('\n')
  });
}

module.exports = {
  sendLeadAlert,
  sendLeadConfirmation,
  sendApplicationAlert,
  sendChatAlert,
  sendChatConfirmation
};
