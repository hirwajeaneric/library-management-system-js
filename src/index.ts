import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import borrowRoutes from './routes/borrowRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import logger from './config/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/user', userRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});