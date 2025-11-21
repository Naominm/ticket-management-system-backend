import express, { Express } from 'express';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
