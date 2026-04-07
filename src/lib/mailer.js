import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT ?? 587),
    secure: false, // STARTTLS
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
}

function loadTemplate(name) {
  const filePath = path.join(process.cwd(), 'emails', `${name}.html`);
  return fs.readFileSync(filePath, 'utf8');
}

function fillTemplate(html, vars) {
  return html
    .replace(/\{\{ \.ConfirmationURL \}\}/g, vars.confirmationUrl ?? '')
    .replace(/\{\{ \.Email \}\}/g, vars.email ?? '');
}

export async function sendResetPasswordEmail(email, resetUrl) {
  const html = fillTemplate(loadTemplate('reset-password'), {
    confirmationUrl: resetUrl,
    email,
  });

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME ?? 'FreelanceHub'}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: email,
    subject: 'Reset Your Password – FreelanceHub',
    html,
  });
}

export async function sendWelcomeFreelancerEmail(email, name, password, loginUrl) {
  const html = loadTemplate('welcome-freelancer')
    .replace(/\{\{ \.Name \}\}/g, name || email)
    .replace(/\{\{ \.Email \}\}/g, email)
    .replace(/\{\{ \.Password \}\}/g, password)
    .replace(/\{\{ \.LoginURL \}\}/g, loginUrl);

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME ?? 'FreelanceHub'}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: email,
    subject: 'Welcome to FreelanceHub – Your Account Details',
    html,
  });
}

export async function sendConfirmationEmail(email, confirmUrl) {
  const html = fillTemplate(loadTemplate('confirm-email'), {
    confirmationUrl: confirmUrl,
    email,
  });

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME ?? 'FreelanceHub'}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: email,
    subject: 'Confirm Your Email Address – FreelanceHub',
    html,
  });
}
