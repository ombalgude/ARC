require('dotenv').config();
const { Resend } = require('./apps/web/node_modules/resend');
const resend = new Resend(process.env.RESEND_API_KEY);

console.log('Sending from:', process.env.RESEND_FROM_EMAIL);

resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL,
  to: 'ombalgude24@gmail.com',
  subject: 'ARC Fitness - Custom Domain Test',
  html: '<h2>ARC Fitness Test</h2><p>Your custom domain arc-contact.ombalgude.app is working!</p>'
}).then(r => {
  if (r.error) {
    console.error('ERROR:', JSON.stringify(r.error, null, 2));
  } else {
    console.log('SUCCESS! Email ID:', r.data.id);
    console.log('Check your inbox at ombalgude24@gmail.com');
  }
}).catch(e => console.error('EXCEPTION:', e.message));
