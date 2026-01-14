import { Router } from 'express';
import {
  createTaskSchema,
  taskIdParamSchema,
  updateTaskSchema,
  getTasksSchema,
} from '../validations/taskValidation.js';
import { celebrate } from 'celebrate';

import {
  getTasks,
  createTask,
  getTaskById,
  deleteTask,
  updateTask,
} from '../controllers/tasksControllers.js';

const router = Router();

router.get('/tasks', celebrate(getTasksSchema), getTasks);

router.get('/tasks/:taskId', celebrate(taskIdParamSchema), getTaskById);

router.post('/tasks', celebrate(createTaskSchema), createTask);

router.delete('/tasks/:taskId', celebrate(taskIdParamSchema), deleteTask);

router.patch('/tasks/:taskId', celebrate(updateTaskSchema), updateTask);

export default router;
