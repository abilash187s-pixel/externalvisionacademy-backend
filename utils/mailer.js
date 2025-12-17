import { Resend } from "resend";

let resend = null;

export function initMailer() {
  console.log("📧 Initializing Resend mailer...");
  
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY not found. Emails will not be sent.");
    return;
  }
  
  resend = new Resend(process.env.RESEND_API_KEY);
  
  // Test Resend connection
  console.log("✅ Resend initialized");
}

export async function sendMail(to, subject, html, options = {}) {
  const { retryCount = 0 } = options;
  
  if (!resend) {
    console.log("⚠️ Resend not initialized. Skipping email to:", to);
    return { success: false, message: "Mailer not initialized" };
  }
  
  console.log(`📤 Attempting to send email to: ${to}`);
  console.log(`📝 Subject: ${subject}`);
  
  try {
    // Convert single email to array
    const recipients = Array.isArray(to) ? to : [to];
    
    // Check if recipient email domain is valid for Resend
    const validRecipients = recipients.filter(email => {
      // Basic email validation
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValid) {
        console.warn(`⚠️ Skipping invalid email: ${email}`);
      }
      return isValid;
    });
    
    if (validRecipients.length === 0) {
      console.warn("⚠️ No valid email recipients");
      return { success: false, message: "No valid recipients" };
    }
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "External Vision Academy <onboarding@resend.dev>",
      to: validRecipients,
      subject: subject,
      html: html,
    });
    
    if (error) {
      console.error("❌ Resend API error:", error);
      
      // Retry logic for rate limits
      if (error.statusCode === 429 && retryCount < 3) {
        console.log(`🔄 Rate limited. Retrying in ${(retryCount + 1) * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
        return sendMail(to, subject, html, { ...options, retryCount: retryCount + 1 });
      }
      
      throw error;
    }
    
    console.log(`✅ Email sent successfully via Resend. ID: ${data?.id}`);
    console.log(`📧 Recipients: ${validRecipients.join(", ")}`);
    
    return { 
      success: true, 
      data, 
      recipients: validRecipients 
    };
    
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    
    // Special handling for unverified sender errors
    if (error.message.includes("not authorized") || error.message.includes("unverified")) {
      console.warn("⚠️ Sender email not verified in Resend.");
      console.log("💡 To fix this:");
      console.log("1. Go to https://resend.com/domains");
      console.log("2. Verify the domain or add the sender email");
      console.log("3. Or use a different verified sender");
    }
    
    return { 
      success: false, 
      error: error.message,
      details: error 
    };
  }
}

// Helper function to send registration emails
export async function sendRegistrationEmail(userData) {
  const { name, email, phone, course } = userData;
  
  const userSubject = "🎉 Registration Successful - External Vision Academy";
  const userHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">🎓 External Vision Academy</h1>
      </div>
      
      <div style="padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #4CAF50;">Welcome, ${name}!</h2>
        
        <p>Thank you for registering with <strong>External Vision Academy</strong>. We're excited to have you on board!</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #555;">Your Registration Details:</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Full Name:</strong></td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email Address:</strong></td>
              <td style="padding: 8px 0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Phone Number:</strong></td>
              <td style="padding: 8px 0;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Selected Course:</strong></td>
              <td style="padding: 8px 0;">${course || 'To be discussed'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Registration Date:</strong></td>
              <td style="padding: 8px 0;">${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
          </table>
        </div>
        
        <p><strong>What happens next?</strong></p>
        <ol style="padding-left: 20px;">
          <li>Our academic counselor will contact you within <strong>24 hours</strong> on your WhatsApp number</li>
          <li>We'll schedule an orientation session</li>
          <li>You'll receive course materials and schedule</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://wa.me/918524001495" style="background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            💬 Chat with us on WhatsApp
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="color: #666; font-size: 14px;">
          <strong>Need help?</strong><br>
          Email: <a href="mailto:externalvisionacademy@gmail.com" style="color: #4CAF50;">externalvisionacademy@gmail.com</a><br>
          Phone: <a href="tel:+918524001495" style="color: #4CAF50;">+91 85240 01495</a>
        </p>
        
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
          &copy; ${new Date().getFullYear()} External Vision Academy. All rights reserved.<br>
          Chennai, Tamil Nadu, India
        </p>
      </div>
    </body>
    </html>
  `;
  
  const adminSubject = `📋 New Registration: ${name} - ${course || 'General Inquiry'}`;
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Registration Alert</title>
    </head>
    <body style="font-family: monospace; background: #f8f9fa; padding: 20px;">
      <div style="max-width: 800px; margin: 0 auto;">
        <div style="background: #dc3545; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">🚀 NEW REGISTRATION RECEIVED</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">External Vision Academy</p>
        </div>
        
        <div style="background: white; padding: 25px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <h3 style="color: #333; margin-top: 0;">Student Information:</h3>
          
          <pre style="background: #f8f9fa; padding: 20px; border-radius: 5px; overflow-x: auto; font-size: 14px;">
${JSON.stringify(userData, null, 2)}
          </pre>
          
          <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
            <h4 style="color: #555;">Additional Details:</h4>
            <ul style="color: #666;">
              <li><strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</li>
              <li><strong>Email Verified:</strong> ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '✅ Valid Format' : '⚠️ Check Format'}</li>
              <li><strong>Phone Verified:</strong> ${/^[0-9]{10}$/.test(phone) ? '✅ Valid' : '⚠️ Check'}</li>
            </ul>
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="mailto:${email}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">
                📧 Email Student
              </a>
              <a href="https://wa.me/91${phone}" style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
        
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          Automated Alert • External Vision Academy CRM
        </p>
      </div>
    </body>
    </html>
  `;
  
  // Send user email
  console.log(`📨 Sending confirmation to user: ${email}`);
  const userResult = await sendMail(email, userSubject, userHtml);
  
  // Send admin email
  console.log(`📨 Sending alert to admin`);
  const adminResult = await sendMail(process.env.ADMIN_EMAIL || "externalvisionacademy@gmail.com", adminSubject, adminHtml);
  
  return {
    userEmail: userResult,
    adminEmail: adminResult
  };
}