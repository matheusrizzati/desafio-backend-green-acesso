import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../erros/HttpError'

export const errorHandler = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = (err instanceof HttpError && err.statusCode) || 500;

  console.log(err);

  res.status(status).json({
    message: err.message || 'Houve um erro no servidor. Tente novamente mais tarde.',
    status
  });
};
