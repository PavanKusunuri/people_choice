import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    avatar: {
      type: String, // Cloudinary URL
      default: null,
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    role: {
      type: String,
      enum: ['user', 'critic', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpiry: {
      type: Date,
      select: false,
    },
    watchlist: [
      {
        titleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Title',
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    watchedList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Title',
      },
    ],
    emailSubscribed: {
      type: Boolean,
      default: true, // Opt-in for digest emails
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for user profile URL slug
userSchema.virtual('username').get(function () {
  return this.email.split('@')[0];
});

// Pre-save hook: hash password if modified
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('passwordHash')) return next();

  if (!this.passwordHash) return next();

  try {
    const salt = await bcryptjs.genSalt(12);
    this.passwordHash = await bcryptjs.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method: compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcryptjs.compare(candidatePassword, this.passwordHash);
};

// Method: generate JWT token
userSchema.methods.generateAuthTokens = async function () {
  const { generateAccessToken, generateRefreshToken } = await import(
    '../utils/generateToken.js'
  );
  const accessToken = generateAccessToken(this._id);
  const refreshToken = generateRefreshToken(this._id);
  return { accessToken, refreshToken };
};

// Method: clear sensitive fields
userSchema.methods.toAuthJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.verificationToken;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpiry;
  delete obj.__v;
  return obj;
};

// Transform on toJSON
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.passwordHash;
    delete ret.verificationToken;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpiry;
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

export default User;
