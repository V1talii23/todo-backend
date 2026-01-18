import Task from '../models/task.js';
import createHttpError from 'http-errors';

const getTasks = async (req, res, next) => {
  const {
    page = 1,
    perPage = 10,
    status = 'all',
    search = '',
    sortBy = 'priority',
    sortOrder = 'asc',
  } = req.query;

  const allowedSortFields = [
    'priority',
    'title',
    'status',
    'createdAt',
    'updatedAt',
  ];

  if (!allowedSortFields.includes(sortBy)) {
    return next(
      createHttpError(
        400,
        `Invalid sortBy field. Allowed fields: ${allowedSortFields.join(', ')}`,
      ),
    );
  }

  const skip = (page - 1) * perPage;

  const tasksQuery = Task.find();

  if (search) {
    tasksQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    });
  }

  if (status === 'done' || status === 'undone') {
    tasksQuery.where('status').equals(status);
  }

  const [totalItems, tasks] = await Promise.all([
    tasksQuery.clone().countDocuments(),
    tasksQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 }),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalPages,
    totalItems,
    tasks,
  });
};

const getTaskById = async (req, res, next) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId);

  if (!task) {
    return next(createHttpError(404, 'Task not found'));
  }

  res.status(200).json(task);
};

const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
};

const deleteTask = async (req, res, next) => {
  const { taskId } = req.params;
  const task = await Task.findByIdAndDelete({ _id: taskId });

  if (!task) {
    return next(createHttpError(404, 'Task not found'));
  }

  res.status(200).json(task);
};

const updateTask = async (req, res, next) => {
  const { taskId } = req.params;
  const task = await Task.findByIdAndUpdate({ _id: taskId }, req.body, {
    new: true,
  });

  if (!task) {
    return next(createHttpError(404, 'Task not found'));
  }

  res.status(200).json(task);
};

export { getTasks, getTaskById, createTask, deleteTask, updateTask };
