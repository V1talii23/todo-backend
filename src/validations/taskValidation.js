import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const createTaskSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(30).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least {#limit} characters',
      'string.max': 'Title should have at most {#limit} characters',
      'any.required': 'Title is required',
    }),

    description: Joi.string().min(3).max(200).required().messages({
      'string.base': 'Description must be a string',
      'string.min': 'Description should have at least {#limit} characters',
      'string.max': 'Description should have at most {#limit} characters',
      'any.required': 'Description is required',
    }),

    status: Joi.string().valid('done', 'undone', '').messages({
      'any.base': 'Status must have one of the values: done, undone or empty',
    }),

    priority: Joi.number().integer().min(1).max(10).messages({
      'number.base': 'Priority must be a number',
      'number.min': 'Priority must be a number beetwen 1 to 10 ',
      'number.max': 'Priority must be a number beetwen 1 to 10 ',
      'any.required': 'Priority is required',
    }),
  }),
};

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value)
    ? helpers.message('Invalid id format ')
    : value;
};

const taskIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    taskId: Joi.string().custom(objectIdValidator).required(),
  }),
};

const updateTaskSchema = {
  [Segments.PARAMS]: Joi.object({
    taskId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(30),
    description: Joi.string().min(3).max(200),
    status: Joi.string().valid('done', 'undone'),
    priority: Joi.number().integer().min(1).max(10),
  }).min(1),
};

const getTasksSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    status: Joi.string().valid('done', 'undone'),
    search: Joi.string().trim().allow(''),
    sortBy: Joi.string().valid('_id', 'title', 'priority').default('_id'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  }),
};

export {
  createTaskSchema,
  taskIdParamSchema,
  updateTaskSchema,
  getTasksSchema,
};
