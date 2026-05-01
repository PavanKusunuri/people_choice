import express from 'express';
import {
  register,
  login,
  logout,
  refresh,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validateVerifyEmail,
  validateForgotPassword,
  validateResetPassword,
} from '../validations/authValidation.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

/**
 * POST /api/v1/auth/register
 * Register a new user
 * Body: { name, email, password }
 */
router.post('/register', authLimiter, validateRegister, register);

/**
 * POST /api/v1/auth/login
 * Login user
 * Body: { email, password }
 */
router.post('/login', authLimiter, validateLogin, login);

/**
 * POST /api/v1/auth/logout
 * Logout user (requires authentication)
 */
router.post('/logout', authenticate, logout);

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 * Cookie: refreshToken
 */
router.post('/refresh', refresh);

/**
 * POST /api/v1/auth/verify-email
 * Verify email address
 * Body: { token }
 */
router.post('/verify-email', validateVerifyEmail, verifyEmail);

/**
 * POST /api/v1/auth/forgot-password
 * Request password reset
 * Body: { email }
 */
router.post('/forgot-password', authLimiter, validateForgotPassword, forgotPassword);

/**
 * POST /api/v1/auth/reset-password
 * Reset password with token
 * Body: { token, newPassword }
 */
router.post(
  '/reset-password',
  authLimiter,
  validateResetPassword,
  resetPassword
);

export default router;
