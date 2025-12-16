import { TaskRepository } from '../repositories/task.repository';
import { ITask } from '../models/task.model';
import { io } from '../server';

export class TaskService {
    private taskRepo: TaskRepository;

    constructor() {
        this.taskRepo = new TaskRepository();
    }

    async createTask(data: Partial<ITask>, creatorId: string): Promise<ITask> {
        const task = await this.taskRepo.create({ ...data, creatorId: creatorId as any });
        io.emit('task_created', task);
        return task;
    }

    async getTasks(filter: any = {}, sort: any = {}): Promise<ITask[]> {
        return await this.taskRepo.findAll(filter, sort);
    }

    async getTaskById(id: string): Promise<ITask | null> {
        return await this.taskRepo.findById(id);
    }

    async updateTask(id: string, data: Partial<ITask>): Promise<ITask | null> {
        const task = await this.taskRepo.update(id, data);
        if (task) {
            io.emit('task_updated', task);

            if (data.assignedToId) {
                io.emit('task_assigned_notification', {
                    taskId: task._id,
                    assignedToId: data.assignedToId,
                    message: `You have been assigned to task: ${task.title}`
                });
            }
        }
        return task;
    }

    async deleteTask(id: string): Promise<ITask | null> {
        const task = await this.taskRepo.delete(id);
        if (task) {
            io.emit('task_deleted', id);
        }
        return task;
    }
}
