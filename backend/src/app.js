import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Routes
import authRoutes from './routes/authRoutes.js';

// Middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Logger
import logger from './utils/logger.js';

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Security middleware
app.use(helmet());
app.use(mongoSanitize()); // Prevent NoSQL injection

// HTTP request logging
app.use(
  morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// General rate limiter
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authRoutes);
// More routes will be added here
// app.use('/api/v1/titles', titlesRoutes);
// app.use('/api/v1/people', peopleRoutes);
// app.use('/api/v1/reviews', reviewsRoutes);
// app.use('/api/v1/users', usersRoutes);
// app.use('/api/v1/search', searchRoutes);
// app.use('/api/v1/lists', listsRoutes);
// app.use('/api/v1/admin', adminRoutes);

// Swagger API documentation (will be added later)
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

logger.info('Express app configured');

export default app;
