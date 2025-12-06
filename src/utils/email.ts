// Email utility for sending notifications
// TODO: Configure email service (Resend, SendGrid, or AWS SES)
// For now, this is a placeholder that logs email data

type EmailData = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

/**
 * Send email notification
 * @param _data Email configuration
 */
export async function sendEmail(_data: EmailData): Promise<{ success: boolean; error?: string }> {
  // TODO: Implement actual email sending with Resend or SendGrid
  // For MVP, we'll just log the email data
  // In production, use a proper logging solution

  // Uncomment when you have email service configured:
  /*
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: data.from || 'FlowStack Pro <onboarding@flowstackpro.com>',
        to: data.to,
        subject: data.subject,
        html: data.html,
      }),
    });

    if (!res.ok) {
      throw new Error(`Email API error: ${res.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[EMAIL] Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
  */

  // For now, always return success (dev mode)
  return { success: true };
}

/**
 * Send onboarding confirmation email to client
 */
export async function sendOnboardingConfirmationEmail(params: {
  clientEmail: string;
  clientName: string;
  organizationName: string;
}) {
  const { clientEmail, clientName, organizationName } = params;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${organizationName}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ${organizationName}!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${clientName},</p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you for completing your onboarding with us! We're excited to start working with you.
          </p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Your account has been set up and you can now access your client portal to:
          </p>
          
          <ul style="font-size: 16px; margin-bottom: 30px; padding-left: 20px;">
            <li style="margin-bottom: 10px;">View your projects and tasks</li>
            <li style="margin-bottom: 10px;">Track progress in real-time</li>
            <li style="margin-bottom: 10px;">Manage invoices and payments</li>
            <li style="margin-bottom: 10px;">Communicate with your team</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              Access Client Portal
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 30px; border-top: 1px solid #e0e0e0;">
            If you have any questions, feel free to reach out to us at any time.
          </p>
          
          <p style="font-size: 14px; color: #666;">
            Best regards,<br>
            <strong>${organizationName} Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} ${organizationName}. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: clientEmail,
    subject: `Welcome to ${organizationName}!`,
    html,
    from: `${organizationName} <noreply@flowstackpro.com>`,
  });
}

/**
 * Send onboarding notification to organization owner
 */
export async function sendOnboardingNotificationToOwner(params: {
  ownerEmail: string;
  ownerName: string;
  clientName: string;
  clientEmail: string;
  organizationName: string;
}) {
  const { ownerEmail, ownerName, clientName, clientEmail, organizationName } = params;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Client Onboarded</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 30px 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #1a1a1a;">🎉 New Client Onboarded!</h2>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <p style="font-size: 16px;">Hi ${ownerName},</p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Great news! A new client has just completed their onboarding:
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Client Name:</strong> ${clientName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${clientEmail}</p>
          </p>
          
          <p style="font-size: 16px; margin-top: 20px;">
            The client details have been added to your dashboard. You can now assign team members and set up their first project.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/clients" 
               style="display: inline-block; background: #1a1a1a; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              View Client in Dashboard
            </a>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: ownerEmail,
    subject: `New Client: ${clientName}`,
    html,
    from: `${organizationName} <notifications@flowstackpro.com>`,
  });
}
