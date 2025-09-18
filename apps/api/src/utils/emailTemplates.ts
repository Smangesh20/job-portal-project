import { NotificationType } from '@/services/notificationService'

// Base email template interface
interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// Template variables interface
interface TemplateVariables {
  [key: string]: string | number | boolean | undefined
}

// Email template generator
export const emailTemplates = {
  /**
   * Generate welcome email template
   */
  welcome: (variables: TemplateVariables): EmailTemplate => {
    const { name, email, role } = variables
    
    return {
      subject: `Welcome to Ask Ya Cham, ${name}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Ask Ya Cham</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Ask Ya Cham!</h1>
              <p>Your AI-powered job matching journey begins now</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Welcome to Ask Ya Cham, the revolutionary AI-powered job matching platform that connects the right talent with the right opportunities.</p>
              
              <p>As a <strong>${role}</strong>, you now have access to:</p>
              <ul>
                <li>🤖 Advanced AI matching algorithms</li>
                <li>📊 Real-time job recommendations</li>
                <li>🎯 Cultural fit analysis</li>
                <li>📈 Career development insights</li>
                <li>💼 Personalized job alerts</li>
              </ul>
              
              <p>Ready to get started? Complete your profile to unlock the full potential of our AI matching system.</p>
              
              <a href="${process.env.FRONTEND_URL}/dashboard/profile" class="button">Complete Your Profile</a>
              
              <p>If you have any questions, our support team is here to help!</p>
              
              <p>Best regards,<br>The Ask Ya Cham Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Ask Ya Cham. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Ask Ya Cham, ${name}!
        
        Hello ${name}!
        
        Welcome to Ask Ya Cham, the revolutionary AI-powered job matching platform that connects the right talent with the right opportunities.
        
        As a ${role}, you now have access to:
        - Advanced AI matching algorithms
        - Real-time job recommendations
        - Cultural fit analysis
        - Career development insights
        - Personalized job alerts
        
        Ready to get started? Complete your profile to unlock the full potential of our AI matching system.
        
        Visit: ${process.env.FRONTEND_URL}/dashboard/profile
        
        If you have any questions, our support team is here to help!
        
        Best regards,
        The Ask Ya Cham Team
        
        © 2024 Ask Ya Cham. All rights reserved.
        This email was sent to ${email}
      `
    }
  },

  /**
   * Generate email verification template
   */
  emailVerification: (variables: TemplateVariables): EmailTemplate => {
    const { name, email, verificationLink } = variables
    
    return {
      subject: 'Verify your email address - Ask Ya Cham',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .code { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; font-family: monospace; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Verify Your Email</h1>
              <p>Complete your registration</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for signing up with Ask Ya Cham! To complete your registration and start using our platform, please verify your email address.</p>
              
              <p>Click the button below to verify your email:</p>
              
              <a href="${verificationLink}" class="button">Verify Email Address</a>
              
              <p>Or copy and paste this link into your browser:</p>
              <div class="code">${verificationLink}</div>
              
              <p><strong>This link will expire in 24 hours.</strong></p>
              
              <p>If you didn't create an account with Ask Ya Cham, please ignore this email.</p>
              
              <p>Best regards,<br>The Ask Ya Cham Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Ask Ya Cham. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Verify Your Email - Ask Ya Cham
        
        Hello ${name}!
        
        Thank you for signing up with Ask Ya Cham! To complete your registration and start using our platform, please verify your email address.
        
        Click the link below to verify your email:
        ${verificationLink}
        
        This link will expire in 24 hours.
        
        If you didn't create an account with Ask Ya Cham, please ignore this email.
        
        Best regards,
        The Ask Ya Cham Team
        
        © 2024 Ask Ya Cham. All rights reserved.
        This email was sent to ${email}
      `
    }
  },

  /**
   * Generate password reset template
   */
  passwordReset: (variables: TemplateVariables): EmailTemplate => {
    const { name, email, resetLink } = variables
    
    return {
      subject: 'Reset your password - Ask Ya Cham',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Reset Your Password</h1>
              <p>Secure password reset</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>We received a request to reset your password for your Ask Ya Cham account.</p>
              
              <p>Click the button below to reset your password:</p>
              
              <a href="${resetLink}" class="button">Reset Password</a>
              
              <p>Or copy and paste this link into your browser:</p>
              <div class="code">${resetLink}</div>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>
              
              <p>If you didn't request a password reset, please contact our support team immediately.</p>
              
              <p>Best regards,<br>The Ask Ya Cham Security Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Ask Ya Cham. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Reset Your Password - Ask Ya Cham
        
        Hello ${name}!
        
        We received a request to reset your password for your Ask Ya Cham account.
        
        Click the link below to reset your password:
        ${resetLink}
        
        Security Notice:
        - This link will expire in 1 hour
        - If you didn't request this reset, please ignore this email
        - Never share this link with anyone
        
        If you didn't request a password reset, please contact our support team immediately.
        
        Best regards,
        The Ask Ya Cham Security Team
        
        © 2024 Ask Ya Cham. All rights reserved.
        This email was sent to ${email}
      `
    }
  },

  /**
   * Generate job match notification template
   */
  jobMatch: (variables: TemplateVariables): EmailTemplate => {
    const { name, jobTitle, companyName, matchScore, jobLink } = variables
    
    return {
      subject: `🎯 New Job Match Found: ${jobTitle} at ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Job Match Found</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00b894 0%, #00a085 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #00b894; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .match-score { background: #d1f2eb; border: 2px solid #00b894; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0; }
            .job-details { background: white; border: 1px solid #ddd; padding: 20px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New Job Match Found!</h1>
              <p>Our AI found a perfect opportunity for you</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Great news! Our advanced AI matching system found a job that's a perfect fit for your skills and career goals.</p>
              
              <div class="match-score">
                <h3>Match Score: ${matchScore}%</h3>
                <p>This is an excellent match based on your profile!</p>
              </div>
              
              <div class="job-details">
                <h3>${jobTitle}</h3>
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Match Score:</strong> ${matchScore}%</p>
              </div>
              
              <p>This position aligns perfectly with your:</p>
              <ul>
                <li>✅ Skills and experience</li>
                <li>✅ Career preferences</li>
                <li>✅ Cultural fit</li>
                <li>✅ Salary expectations</li>
              </ul>
              
              <a href="${jobLink}" class="button">View Job Details</a>
              
              <p>Don't miss out on this opportunity! Apply now to take the next step in your career.</p>
              
              <p>Best regards,<br>The Ask Ya Cham AI Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Ask Ya Cham. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Job Match Found - Ask Ya Cham
        
        Hello ${name}!
        
        Great news! Our advanced AI matching system found a job that's a perfect fit for your skills and career goals.
        
        Match Score: ${matchScore}%
        Job Title: ${jobTitle}
        Company: ${companyName}
        
        This position aligns perfectly with your:
        - Skills and experience
        - Career preferences
        - Cultural fit
        - Salary expectations
        
        View job details: ${jobLink}
        
        Don't miss out on this opportunity! Apply now to take the next step in your career.
        
        Best regards,
        The Ask Ya Cham AI Team
        
        © 2024 Ask Ya Cham. All rights reserved.
      `
    }
  },

  /**
   * Generate application status update template
   */
  applicationUpdate: (variables: TemplateVariables): EmailTemplate => {
    const { name, jobTitle, companyName, status, applicationLink } = variables
    
    return {
      subject: `📋 Application Update: ${status} - ${jobTitle} at ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #74b9ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .status-badge { display: inline-block; background: #74b9ff; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .application-details { background: white; border: 1px solid #ddd; padding: 20px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Application Update</h1>
              <p>Your application status has been updated</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>We have an update regarding your job application.</p>
              
              <div class="application-details">
                <h3>${jobTitle}</h3>
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Status:</strong> <span class="status-badge">${status}</span></p>
              </div>
              
              <p>You can view more details about your application and next steps by clicking the button below.</p>
              
              <a href="${applicationLink}" class="button">View Application</a>
              
              <p>We'll continue to keep you updated on any changes to your application status.</p>
              
              <p>Best regards,<br>The Ask Ya Cham Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Ask Ya Cham. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Application Status Update - Ask Ya Cham
        
        Hello ${name}!
        
        We have an update regarding your job application.
        
        Job Title: ${jobTitle}
        Company: ${companyName}
        Status: ${status}
        
        You can view more details about your application and next steps by visiting:
        ${applicationLink}
        
        We'll continue to keep you updated on any changes to your application status.
        
        Best regards,
        The Ask Ya Cham Team
        
        © 2024 Ask Ya Cham. All rights reserved.
      `
    }
  },

  /**
   * Generate interview scheduled template
   */
  interviewScheduled: (variables: TemplateVariables): EmailTemplate => {
    const { name, jobTitle, companyName, interviewDate, interviewTime, location, interviewLink } = variables
    
    return {
      subject: `📅 Interview Scheduled: ${jobTitle} at ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Interview Scheduled</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #fd79a8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .interview-details { background: white; border: 1px solid #ddd; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .date-time { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Interview Scheduled</h1>
              <p>Your interview has been confirmed</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Congratulations! Your interview has been scheduled for the following position.</p>
              
              <div class="interview-details">
                <h3>${jobTitle}</h3>
                <p><strong>Company:</strong> ${companyName}</p>
                
                <div class="date-time">
                  <p><strong>📅 Date:</strong> ${interviewDate}</p>
                  <p><strong>🕒 Time:</strong> ${interviewTime}</p>
                  <p><strong>📍 Location:</strong> ${location}</p>
                </div>
              </div>
              
              ${interviewLink ? `<a href="${interviewLink}" class="button">Join Interview</a>` : ''}
              
              <h3>Interview Preparation Tips:</h3>
              <ul>
                <li>✅ Research the company and role thoroughly</li>
                <li>✅ Prepare questions to ask the interviewer</li>
                <li>✅ Review your resume and key achievements</li>
                <li>✅ Dress professionally</li>
                <li>✅ Arrive 10-15 minutes early</li>
              </ul>
              
              <p>Good luck with your interview! We're rooting for your success.</p>
              
              <p>Best regards,<br>The Ask Ya Cham Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Ask Ya Cham. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Interview Scheduled - Ask Ya Cham
        
        Hello ${name}!
        
        Congratulations! Your interview has been scheduled for the following position.
        
        Job Title: ${jobTitle}
        Company: ${companyName}
        Date: ${interviewDate}
        Time: ${interviewTime}
        Location: ${location}
        
        ${interviewLink ? `Join Interview: ${interviewLink}` : ''}
        
        Interview Preparation Tips:
        - Research the company and role thoroughly
        - Prepare questions to ask the interviewer
        - Review your resume and key achievements
        - Dress professionally
        - Arrive 10-15 minutes early
        
        Good luck with your interview! We're rooting for your success.
        
        Best regards,
        The Ask Ya Cham Team
        
        © 2024 Ask Ya Cham. All rights reserved.
      `
    }
  },

  /**
   * Generate notification template based on type
   */
  generateNotificationTemplate: (type: NotificationType, variables: TemplateVariables): EmailTemplate => {
    switch (type) {
      case NotificationType.JOB_MATCH:
        return emailTemplates.jobMatch(variables)
      case NotificationType.APPLICATION_UPDATE:
        return emailTemplates.applicationUpdate(variables)
      case NotificationType.INTERVIEW_SCHEDULED:
        return emailTemplates.interviewScheduled(variables)
      default:
        return {
          subject: 'Notification from Ask Ya Cham',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Notification</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🔔 Notification</h1>
                  <p>Update from Ask Ya Cham</p>
                </div>
                <div class="content">
                  <h2>Hello ${variables.name || 'User'}!</h2>
                  <p>${variables.message || 'You have a new notification from Ask Ya Cham.'}</p>
                  <p>Best regards,<br>The Ask Ya Cham Team</p>
                </div>
                <div class="footer">
                  <p>© 2024 Ask Ya Cham. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `,
          text: `
            Notification from Ask Ya Cham
            
            Hello ${variables.name || 'User'}!
            
            ${variables.message || 'You have a new notification from Ask Ya Cham.'}
            
            Best regards,
            The Ask Ya Cham Team
            
            © 2024 Ask Ya Cham. All rights reserved.
          `
        }
    }
  }
}

// Export email templates
export { emailTemplates }
