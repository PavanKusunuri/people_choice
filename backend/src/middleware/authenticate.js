import ApiError from '../utils/ApiError.js';
import { verifyToken, isRefreshTokenBlacklisted } from '../utils/generateToken.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

/**
 * Middleware to authenticate users
 * Checks Authorization header for Bearer token or refresh cookie
 */
export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Try to get access token from Authorization header
    if (req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      throw new ApiError(401, 'Access token is missing or invalid format');
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Access token has expired. Please refresh.');
      }
      throw new ApiError(401, 'Invalid access token');
    }

    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    next();
  } catch (error) {
    logger.error(`Authentication Error: ${error.message}`);
    next(error);
  }
};

/**
 * Middleware to authorize by role
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ApiError(
          403,
          `Only ${allowedRoles.join(', ')} role(s) can access this resource`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if user is owner of resource
 */
export const isOwner = (fieldName = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const resourceOwnerId = req.body[fieldName] || req.params[fieldName];
      if (req.user.id.toString() !== resourceOwnerId?.toString()) {
        throw new ApiError(403, 'You do not have permission to access this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if refresh token is blacklisted
 */
export const checkRefreshTokenBlacklist = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next();
    }

    const isBlacklisted = await isRefreshTokenBlacklisted(refreshToken);
    if (isBlacklisted) {
      throw new ApiError(401, 'Refresh token has been revoked');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default {
  authenticate,
  authorize,
  isOwner,
  checkRefreshTokenBlacklist,
};
