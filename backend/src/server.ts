import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { env } from './config/env';
import mongoose from 'mongoose';

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    },
});

export { io };

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_task_room', (taskId) => {
        socket.join(taskId);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const startServer = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log('Connected to MongoDB');

        server.listen(env.PORT, () => {
            console.log(`Server running on port ${env.PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to DB', error);
        process.exit(1);
    }
};

startServer();
