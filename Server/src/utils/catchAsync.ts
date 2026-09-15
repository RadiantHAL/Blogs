import { Request, Response, NextFunction } from "express";

/**
 * Wrapper to catch async errors and pass them to the next middleware
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
