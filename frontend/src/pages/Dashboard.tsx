import { useState, useEffect } from 'react';
import useSWR from 'swr';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { type Task, TaskPriority, TaskStatus } from '../types';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import TaskModal from '../components/TaskModal';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function Dashboard() {
    const { user, logout } = useAuth();
    const socket = useSocket();
    const { data: tasks, mutate } = useSWR<Task[]>('/tasks', fetcher);

    const [filterStatus, setFilterStatus] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('dueDate');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        if (!socket) return;

        socket.on('task_created', (newTask: Task) => {
            mutate((prev) => prev ? [...prev, newTask] : [newTask], false);
        });

        socket.on('task_updated', (updatedTask: Task) => {
            mutate((prev) => prev ? prev.map(t => t._id === updatedTask._id ? updatedTask : t) : [], false);
        });

        socket.on('task_deleted', (deletedId: string) => {
            mutate((prev) => prev ? prev.filter(t => t._id !== deletedId) : [], false);
        });

        socket.on('task_assigned_notification', (data: { message: string }) => {
            // In a real app, use a toast
            alert(data.message);
        });

        return () => {
            socket.off('task_created');
            socket.off('task_updated');
            socket.off('task_deleted');
            socket.off('task_assigned_notification');
        };
    }, [socket, mutate]);

    const filteredTasks = tasks?.filter(task => {
        if (filterStatus && task.status !== filterStatus) return false;
        return true;
    }).sort((a, b) => {
        if (sortBy === 'dueDate') {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return 0;
    });

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleNewTask = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    if (!tasks) return <div className="flex h-screen items-center justify-center text-primary">Loading tasks...</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Task Dashboard</h1>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Welcome, {user?.name}</span>
                        <button onClick={logout} className="px-4 py-2 text-sm bg-surface rounded-md hover:bg-slate-700 transition">Logout</button>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <select
                        className="bg-surface border border-slate-700 rounded-md px-3 py-2 text-sm text-gray-300"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        className="bg-surface border border-slate-700 rounded-md px-3 py-2 text-sm text-gray-300"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="dueDate">Sort by Due Date</option>
                    </select>
                </div>
                <button onClick={handleNewTask} className="flex items-center gap-2 bg-primary px-4 py-2 rounded-md hover:bg-blue-600 transition text-white font-medium shadow-lg shadow-blue-500/20">
                    <Plus size={18} /> New Task
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks?.map(task => (
                    <div key={task._id} onClick={() => handleEditTask(task)} className="bg-surface p-5 rounded-xl border border-slate-700 shadow-lg hover:border-primary transition-colors group cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${task.priority === TaskPriority.URGENT ? 'bg-red-500/20 text-red-400' :
                                    task.priority === TaskPriority.HIGH ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-blue-500/20 text-blue-400'}`}>
                                {task.priority}
                            </span>
                            <span className="text-xs text-gray-400">{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-100 group-hover:text-primary transition-colors">{task.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{task.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500 border-t border-slate-700 pt-3">
                            <span>Assignee: {task.assignedToId?.name || 'Unassigned'}</span>
                            <span className="capitalize text-gray-300">{task.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} task={selectedTask} />
        </div>
    );
}
