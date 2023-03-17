import { NextFunction, Request } from "express";
import { getToken } from "./getToken";
import jwt from "jsonwebtoken";

interface DecodedType {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export const getIdFromToken = (req: Request) => {
  const token = getToken(req);

  if (!token) {
    throw new Error("Authorization token is required");
  }
  const decoded = jwt.verify(token, process.env.SECRET_STRING!) as DecodedType;

  return decoded.id;
};
