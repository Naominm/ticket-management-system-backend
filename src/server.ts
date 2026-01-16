import express, { Express } from 'express';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/createTicketRoute.js';
import userRoutes from './routes/userRoutes.js';
import assignRoutes from './routes/ticketRoute.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/ticket', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assign', assignRoutes);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
