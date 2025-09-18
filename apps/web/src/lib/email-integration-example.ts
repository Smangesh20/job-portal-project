// Email Service Integration Examples
// This file shows how to integrate with real email services

// Example 1: SendGrid Integration
export const sendGridIntegration = {
  async sendEmail(emailData: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }) {
    // Install: npm install @sendgrid/mail
    const sgMail = require('@sendgrid/mail');
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: emailData.to,
      from: process.env.FROM_EMAIL, // Verified sender
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    };
    
    try {
      await sgMail.send(msg);
      return { success: true, messageId: 'sent' };
    } catch (error) {
      console.error('SendGrid error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Example 2: Mailgun Integration
export const mailgunIntegration = {
  async sendEmail(emailData: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }) {
    // Install: npm install mailgun-js
    const mailgun = require('mailgun-js')({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    });
    
    const data = {
      from: process.env.FROM_EMAIL,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html
    };
    
    try {
      const result = await mailgun.messages().send(data);
      return { success: true, messageId: result.id };
    } catch (error) {
      console.error('Mailgun error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Example 3: AWS SES Integration
export const awsSesIntegration = {
  async sendEmail(emailData: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }) {
    // Install: npm install aws-sdk
    const AWS = require('aws-sdk');
    
    const ses = new AWS.SES({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    
    const params = {
      Destination: {
        ToAddresses: [emailData.to]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: emailData.html
          },
          Text: {
            Charset: 'UTF-8',
            Data: emailData.text
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: emailData.subject
        }
      },
      Source: process.env.FROM_EMAIL
    };
    
    try {
      const result = await ses.sendEmail(params).promise();
      return { success: true, messageId: result.MessageId };
    } catch (error) {
      console.error('AWS SES error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Example 4: Nodemailer Integration (SMTP)
export const nodemailerIntegration = {
  async sendEmail(emailData: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }) {
    // Install: npm install nodemailer
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html
    };
    
    try {
      const result = await transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Nodemailer error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Environment Variables needed:
export const requiredEnvVars = {
  sendgrid: ['SENDGRID_API_KEY', 'FROM_EMAIL'],
  mailgun: ['MAILGUN_API_KEY', 'MAILGUN_DOMAIN', 'FROM_EMAIL'],
  awsSes: ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'FROM_EMAIL'],
  nodemailer: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS', 'FROM_EMAIL']
};

// Integration Instructions:
export const integrationInstructions = {
  sendgrid: {
    steps: [
      '1. Sign up at https://sendgrid.com',
      '2. Create an API key in Settings > API Keys',
      '3. Verify your sender email in Settings > Sender Authentication',
      '4. Add SENDGRID_API_KEY and FROM_EMAIL to your .env file',
      '5. Replace the sendEmail method in email-service.ts with sendGridIntegration.sendEmail'
    ],
    cost: 'Free tier: 100 emails/day',
    pros: ['Reliable delivery', 'Good analytics', 'Easy integration'],
    cons: ['Can be expensive for high volume']
  },
  
  mailgun: {
    steps: [
      '1. Sign up at https://mailgun.com',
      '2. Get your API key from Dashboard',
      '3. Add your domain and verify it',
      '4. Add MAILGUN_API_KEY, MAILGUN_DOMAIN, and FROM_EMAIL to your .env file',
      '5. Replace the sendEmail method in email-service.ts with mailgunIntegration.sendEmail'
    ],
    cost: 'Free tier: 5,000 emails/month for 3 months',
    pros: ['Developer-friendly', 'Good free tier', 'Reliable'],
    cons: ['Requires domain verification']
  },
  
  awsSes: {
    steps: [
      '1. Sign up for AWS account',
      '2. Go to SES service in AWS Console',
      '3. Verify your email address',
      '4. Create IAM user with SES permissions',
      '5. Add AWS credentials and FROM_EMAIL to your .env file',
      '6. Replace the sendEmail method in email-service.ts with awsSesIntegration.sendEmail'
    ],
    cost: 'Very cheap: $0.10 per 1,000 emails',
    pros: ['Very cost-effective', 'Scalable', 'AWS integration'],
    cons: ['More complex setup', 'Requires AWS knowledge']
  }
};
