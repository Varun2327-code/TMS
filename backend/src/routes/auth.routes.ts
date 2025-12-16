import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', validate(RegisterDto), AuthController.register);
router.post('/login', validate(LoginDto), AuthController.login);
router.get('/me', authenticate, AuthController.getMe);

export default router;
