import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { env } from '../config/env';

export class AuthService {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository();
    }

    async register(name: string, email: string, password: string): Promise<{ user: IUser; token: string }> {
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.userRepo.create({ name, email, passwordHash });
        const token = this.generateToken(user._id.toString());

        return { user, token };
    }

    async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user._id.toString());
        return { user, token };
    }

    private generateToken(userId: string): string {
        return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: '7d' });
    }

    async getUserById(id: string): Promise<IUser | null> {
        return this.userRepo.findById(id);
    }
}
