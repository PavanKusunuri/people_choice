import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  generateResetToken,
  verifyToken,
  blacklistRefreshToken,
} from '../utils/generateToken.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from '../services/emailService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'Email already in use');
  }

  // Create new user
  const user = new User({
    name,
    email: email.toLowerCase(),
    passwordHash: password,
    provider: 'local',
  });

  await user.save();

  // Generate verification token
  const verificationToken = generateVerificationToken(user._id, user.email);

  // Send verification email
  try {
    await sendVerificationEmail(user.email, user.name, verificationToken);
  } catch (error) {
    logger.warn(`Could not send verification email to ${user.email}: ${error.message}`);
    // Don't fail the registration if email fails
  }

  // Generate auth tokens
  const { accessToken, refreshToken } = await user.generateAuthTokens();

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const userResponse = user.toAuthJSON();

  res.status(201).json(
    new ApiResponse(201, { user: userResponse, accessToken }, 'User registered successfully')
  );
});

/**
 * POST /api/v1/auth/login
 * Login user with email and password
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+passwordHash'
  );

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  // Generate auth tokens
  const { accessToken, refreshToken } = await user.generateAuthTokens();

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const userResponse = user.toAuthJSON();

  res.status(200).json(
    new ApiResponse(200, { user: userResponse, accessToken }, 'Login successful')
  );
});

/**
 * POST /api/v1/auth/logout
 * Logout user - blacklist refresh token
 */
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    try {
      const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
      const expiryTime = decoded.exp - Math.floor(Date.now() / 1000);
      if (expiryTime > 0) {
        await blacklistRefreshToken(refreshToken, expiryTime);
      }
    } catch (error) {
      logger.warn(`Could not blacklist token: ${error.message}`);
    }
  }

  // Clear refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json(new ApiResponse(200, null, 'Logout successful'));
});

/**
 * POST /api/v1/auth/refresh
 * Refresh access token using refresh token from cookie
 */
export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is missing');
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      throw new ApiError(401, 'Refresh token has expired. Please login again.');
    }
    throw new ApiError(401, 'Invalid refresh token');
  }

  // Get user
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // Blacklist old refresh token and set new one
  try {
    const expiryTime = decoded.exp - Math.floor(Date.now() / 1000);
    if (expiryTime > 0) {
      await blacklistRefreshToken(refreshToken, expiryTime);
    }
  } catch (error) {
    logger.warn(`Could not blacklist old token: ${error.message}`);
  }

  // Set new refresh token cookie
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json(
    new ApiResponse(200, { accessToken: newAccessToken }, 'Token refreshed successfully')
  );
});

/**
 * POST /api/v1/auth/verify-email
 * Verify user email with token
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  // Verify token
  let decoded;
  try {
    decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new ApiError(400, 'Invalid or expired verification token');
  }

  // Find user and update verification status
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.isVerified) {
    return res.status(200).json(
      new ApiResponse(200, null, 'Email already verified')
    );
  }

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, null, 'Email verified successfully')
  );
});

/**
 * POST /api/v1/auth/forgot-password
 * Send password reset email
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // Don't reveal if email exists or not
    return res.status(200).json(
      new ApiResponse(200, null, 'If email exists, password reset link has been sent')
    );
  }

  // Generate reset token
  const resetToken = generateResetToken(user._id, user.email);

  // Save reset token to user
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // Send reset email
  try {
    await sendPasswordResetEmail(user.email, user.name, resetToken);
  } catch (error) {
    logger.error(`Failed to send password reset email: ${error.message}`);
    throw new ApiError(500, 'Failed to send password reset email');
  }

  res.status(200).json(
    new ApiResponse(200, null, 'If email exists, password reset link has been sent')
  );
});

/**
 * POST /api/v1/auth/reset-password
 * Reset password with token
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  // Verify token
  let decoded;
  try {
    decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  // Find user
  const user = await User.findById(decoded.userId).select('+resetPasswordToken +resetPasswordExpiry');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Check if token matches
  if (user.resetPasswordToken !== token) {
    throw new ApiError(400, 'Invalid reset token');
  }

  // Check if token is expired
  if (new Date() > user.resetPasswordExpiry) {
    throw new ApiError(400, 'Reset token has expired');
  }

  // Update password
  user.passwordHash = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpiry = null;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, null, 'Password reset successfully')
  );
});

export default {
  register,
  login,
  logout,
  refresh,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
