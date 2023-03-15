import { Request, Response } from "express";

export const createRole = async (req: Request, res: Response) => {
  try {
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllRoles = async (req: Request, res: Response) => {};
