import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Task, TaskPriority, TaskStatus } from '../types';
import api from '../services/api';
import { X } from 'lucide-react';

const schema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1),
    dueDate: z.string(),
    priority: z.nativeEnum(TaskPriority),
    status: z.nativeEnum(TaskStatus),
});

type FormData = z.infer<typeof schema>;

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
}

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            priority: TaskPriority.MEDIUM,
            status: TaskStatus.TODO,
        }
    });

    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description,
                dueDate: new Date(task.dueDate).toISOString().split('T')[0],
                priority: task.priority,
                status: task.status,
            });
        } else {
            reset({
                title: '',
                description: '',
                dueDate: '',
                priority: TaskPriority.MEDIUM,
                status: TaskStatus.TODO,
            });
        }
    }, [task, reset, isOpen]);

    const onSubmit = async (data: FormData) => {
        try {
            if (task) {
                await api.patch(`/tasks/${task._id}`, data);
            } else {
                await api.post('/tasks', data);
            }
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to save task');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-surface rounded-xl shadow-2xl border border-slate-700">
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-white">{task ? 'Edit Task' : 'Create Task'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input {...register('title')} className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition" />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea {...register('description')} rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition" />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                            <input type="date" {...register('dueDate')} className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition" />
                            {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                            <select {...register('priority')} className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition">
                                {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                        <select {...register('status')} className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition">
                            {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition">
                            {task ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
