const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  const targetEmail = process.argv[2];
  if (!targetEmail) {
    console.error("❌ Please provide a target email address.");
    console.error("Usage: node test-resend.js <your-email@example.com>");
    process.exit(1);
  }

  console.log(`Sending test email to: ${targetEmail}`);
  console.log(`Using sender: ${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}`);

  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: targetEmail,
      subject: 'ARC Fitness - Resend Integration Test',
      html: '<div style="font-family: sans-serif; padding: 20px;"><h2>Test Successful! 🚀</h2><p>If you are reading this, your Resend API key and email setup in ARC Fitness are working perfectly.</p></div>'
    });
    
    if (data.error) {
      console.error("\n❌ Failed to send email:");
      console.error(data.error);
    } else {
      console.log("\n✅ Success! Email sent successfully. Response ID:");
      console.log(data.data.id);
    }
  } catch (error) {
    console.error("\n❌ Unexpected Error sending email:", error);
  }
}

testEmail();
