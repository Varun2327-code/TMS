import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../models/task.model';

export const CreateTaskDto = z.object({
    title: z.string().max(100),
    description: z.string(),
    dueDate: z.string().transform((str) => new Date(str)),
    priority: z.nativeEnum(TaskPriority).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    assignedToId: z.string().optional(),
});

export const UpdateTaskDto = CreateTaskDto.partial();
