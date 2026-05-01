import jwt from 'jsonwebtoken';
import { getRedis } from '../config/redis.js';

/**
 * Generate JWT access token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
  );
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

/**
 * Generate email verification token (24 hours expiry)
 */
export const generateVerificationToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Generate password reset token (1 hour expiry)
 */
export const generateResetToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Verify JWT token
 */
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

/**
 * Blacklist refresh token in Redis
 * @param {string} token - refresh token
 * @param {number} expiryTime - token expiry time in seconds
 */
export const blacklistRefreshToken = async (token, expiryTime) => {
  const redis = getRedis();
  const tokenHash = Buffer.from(token).toString('base64');
  await redis.setex(`blacklist:${tokenHash}`, expiryTime, 'true');
};

/**
 * Check if refresh token is blacklisted
 */
export const isRefreshTokenBlacklisted = async (token) => {
  const redis = getRedis();
  const tokenHash = Buffer.from(token).toString('base64');
  const exists = await redis.exists(`blacklist:${tokenHash}`);
  return exists === 1;
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  generateResetToken,
  verifyToken,
  blacklistRefreshToken,
  isRefreshTokenBlacklisted,
};
