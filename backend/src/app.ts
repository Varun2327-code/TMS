import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));

app.get('/', (req, res) => {
    res.send('Task Management API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

export default app;
