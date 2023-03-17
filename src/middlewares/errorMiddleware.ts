import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    status: false,
    error: err,
  });
};
