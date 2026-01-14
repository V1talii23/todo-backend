import { HttpError } from 'http-errors';

const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  const isProd = process.env.NODE_ENV === 'production';
  res
    .status(500)
    .json({ message: isProd ? 'Internal server error' : err.message });
};

export default errorHandler;
