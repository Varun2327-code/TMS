import Task, { ITask } from '../models/task.model';

export class TaskRepository {
    async create(data: Partial<ITask>): Promise<ITask> {
        return await Task.create(data).then(t => t.populate(['creatorId', 'assignedToId']));
    }

    async findAll(filter: any = {}, sort: any = {}): Promise<ITask[]> {
        return await Task.find(filter).sort(sort).populate('assignedToId', 'name email').populate('creatorId', 'name email');
    }

    async findById(id: string): Promise<ITask | null> {
        return await Task.findById(id).populate('assignedToId', 'name email').populate('creatorId', 'name email');
    }

    async update(id: string, data: Partial<ITask>): Promise<ITask | null> {
        return await Task.findByIdAndUpdate(id, data, { new: true }).populate('assignedToId', 'name email').populate('creatorId', 'name email');
    }

    async delete(id: string): Promise<ITask | null> {
        return await Task.findByIdAndDelete(id);
    }
}
