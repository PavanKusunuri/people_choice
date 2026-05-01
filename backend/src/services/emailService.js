import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.sendgrid.net',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY || '',
  },
});

/**
 * Send verification email
 */
export const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@cinevault.com',
      to: email,
      subject: 'Verify Your CineVault Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to CineVault, ${name}!</h2>
          <p>Thank you for registering. Please verify your email address to activate your account.</p>
          <p>
            <a href="${verificationUrl}" style="display: inline-block; background-color: #f5c518; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
          </p>
          <p>Or copy and paste this link in your browser:</p>
          <p><small>${verificationUrl}</small></p>
          <p>This link expires in 24 hours.</p>
          <hr />
          <p style="color: #999; font-size: 12px;">
            If you didn't create this account, please ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send verification email: ${error.message}`);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@cinevault.com',
      to: email,
      subject: 'Reset Your CineVault Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to reset it.</p>
          <p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #f5c518; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
          </p>
          <p>Or copy and paste this link in your browser:</p>
          <p><small>${resetUrl}</small></p>
          <p>This link expires in 1 hour.</p>
          <hr />
          <p style="color: #999; font-size: 12px;">
            If you didn't request this, please ignore this email and your password will remain unchanged.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send password reset email: ${error.message}`);
    throw error;
  }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@cinevault.com',
      to: email,
      subject: 'Welcome to CineVault!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to CineVault, ${name}!</h2>
          <p>Your account has been successfully created.</p>
          <p>Start exploring your favorite movies, TV shows, and more. You can now:</p>
          <ul>
            <li>Create and manage your watchlist</li>
            <li>Rate and review your favorite titles</li>
            <li>Discover new content based on your preferences</li>
            <li>Follow critics and read their reviews</li>
          </ul>
          <p>Happy watching!</p>
          <p>
            <a href="${process.env.CLIENT_URL}" style="display: inline-block; background-color: #f5c518; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Go to CineVault
            </a>
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send welcome email: ${error.message}`);
    throw error;
  }
};

/**
 * Send review approved notification
 */
export const sendReviewApprovedEmail = async (email, name, titleName, reviewUrl) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@cinevault.com',
      to: email,
      subject: 'Your Review Has Been Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Review is Live!</h2>
          <p>Hi ${name},</p>
          <p>Your review for <strong>${titleName}</strong> has been approved and is now visible to other users.</p>
          <p>
            <a href="${reviewUrl}" style="display: inline-block; background-color: #f5c518; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Your Review
            </a>
          </p>
          <p>Thank you for contributing to the CineVault community!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Review approved email sent to ${email}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send review approved email: ${error.message}`);
    throw error;
  }
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendReviewApprovedEmail,
};
