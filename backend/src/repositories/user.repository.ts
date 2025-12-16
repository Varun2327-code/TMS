import User, { IUser } from '../models/user.model';

export class UserRepository {
    async create(data: Partial<IUser>): Promise<IUser> {
        return await User.create(data);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async findById(id: string): Promise<IUser | null> {
        return await User.findById(id).select('-passwordHash');
    }
}
