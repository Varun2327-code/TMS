import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const taskService = new TaskService();

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const task = await taskService.createTask(req.body, userId);
        res.status(201).json(task);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const { status, priority, sortBy, order } = req.query;
        const filter: any = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const sort: any = {};
        if (sortBy) {
            sort[sortBy as string] = order === 'desc' ? -1 : 1;
        }

        const tasks = await taskService.getTasks(filter, sort);
        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const task = await taskService.deleteTask(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
