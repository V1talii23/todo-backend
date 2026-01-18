import { Schema, model } from 'mongoose';

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['done', 'undone', 'all'],
      default: 'all',
    },
    priority: {
      type: Number,
      required: true,
      min: [1, 'Priority must be between 1 and 10'],
      max: [10, 'Priority must be between 1 and 10'],
    },
  },
  { timestamps: true, versionKey: false },
);

taskSchema.index(
  { title: 'text', description: 'text' },
  {
    title: 'titleTextIndex',
    description: 'descriptionTextIndex',
    weights: { title: 10, description: 7 },
    default_language: 'english',
  },
);

const Task = model('Task', taskSchema);

export default Task;
