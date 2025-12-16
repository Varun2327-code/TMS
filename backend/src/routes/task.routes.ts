import { Router } from 'express';
import * as TaskController from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';

const router = Router();

router.use(authenticate);

router.post('/', validate(CreateTaskDto), TaskController.createTask);
router.get('/', TaskController.getTasks);
router.get('/:id', TaskController.getTaskById);
router.patch('/:id', validate(UpdateTaskDto), TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;
