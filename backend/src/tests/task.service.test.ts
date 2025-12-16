import { TaskService } from '../services/task.service';
import { TaskRepository } from '../repositories/task.repository';
import { io } from '../server';

// Mock dependencies
jest.mock('../repositories/task.repository');
jest.mock('../server', () => ({
    io: {
        emit: jest.fn(),
    },
}));

describe('TaskService', () => {
    let taskService: TaskService;
    let mockTaskRepo: jest.Mocked<TaskRepository>;

    beforeEach(() => {
        mockTaskRepo = new TaskRepository() as jest.Mocked<TaskRepository>;
        (TaskRepository as jest.Mock).mockImplementation(() => mockTaskRepo);
        taskService = new TaskService();
        jest.clearAllMocks();
    });

    describe('createTask', () => {
        it('should create a task and emit socket event', async () => {
            const taskData = { title: 'Test Task' };
            const creatorId = 'user123';
            const createdTask = { ...taskData, creatorId, _id: 'task123' };

            mockTaskRepo.create.mockResolvedValue(createdTask as any);

            const result = await taskService.createTask(taskData, creatorId);

            expect(mockTaskRepo.create).toHaveBeenCalledWith(expect.objectContaining({ ...taskData, creatorId }));
            expect(io.emit).toHaveBeenCalledWith('task_created', createdTask);
            expect(result).toEqual(createdTask);
        });
    });

    describe('updateTask', () => {
        it('should update a task and emit update event', async () => {
            const taskId = 'task123';
            const updateData = { status: 'In Progress' };
            const updatedTask = { _id: taskId, ...updateData, title: 'Test Task' };

            mockTaskRepo.update.mockResolvedValue(updatedTask as any);

            const result = await taskService.updateTask(taskId, updateData as any);

            expect(mockTaskRepo.update).toHaveBeenCalledWith(taskId, updateData);
            expect(io.emit).toHaveBeenCalledWith('task_updated', updatedTask);
            expect(result).toEqual(updatedTask);
        });

        it('should emit notification if assignedToId changes', async () => {
            const taskId = 'task123';
            const updateData = { assignedToId: 'user456' };
            const updatedTask = { _id: taskId, ...updateData, title: 'Test Task' };

            mockTaskRepo.update.mockResolvedValue(updatedTask as any);

            await taskService.updateTask(taskId, updateData as any);

            expect(io.emit).toHaveBeenCalledWith('task_assigned_notification', expect.objectContaining({
                taskId,
                assignedToId: 'user456'
            }));
        });
    });
});
