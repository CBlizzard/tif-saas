import jwt from "jsonwebtoken";
import { Request } from "express";

interface Token {
  id: string;
  email: string;
}

export const createAuthToken = ({ id, email }: Token) => {
  return jwt.sign({ id, email }, process.env.SECRET_STRING!, {
    expiresIn: "1d",
  });
};

// ========================================

export const getToken = (req: Request) => {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

// ========================================
