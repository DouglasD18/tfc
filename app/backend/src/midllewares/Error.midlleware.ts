import { ErrorRequestHandler } from 'express';

const errors: Record<string, number> = {
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
};

const errorMidlleware: ErrorRequestHandler = (err, _res, res, next) => {
  const { name, message } = err;

  const code = errors[name];
  if (!code) return res.sendStatus(500);
  return res.status(code).json({ message });

  next();
};

export default errorMidlleware;
