import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import { Snowflake } from "@theinternetfolks/snowflake";
import { UserModel } from "../models/userModel";
import { createToken } from "../utils/createToken";
import { getToken } from "../utils/getToken";

// ======================
interface DecodedType {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

// ======================
export const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const created_at = new Date().toISOString();
  const id = Snowflake.generate();

  try {
    //validate
    if (!name || !email || !password) {
      return res.status(400).json({ message: "all fields must be filled" });
    }

    if (!validator.isLength(name, { min: 2 })) {
      return res.status(400).json({ message: "minimum 2 characters required in name" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "invalid email" });
    }

    if (!validator.isLength(password, { min: 6 })) {
      return res.status(400).json({ message: "minimum 6 characters required in password" });
    }

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await UserModel.create({ id, name, email, password: hash, created_at });

    const token = createToken({ id: id, email: email });

    res.status(200).json({
      status: true,
      content: {
        id: id,
        name: name,
        email: email,
        created_at: created_at,
      },
      meta: {
        access_token: token,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "email not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = createToken({ id: user.id, email: user.email });

    res.status(200).json({
      status: true,
      content: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
      meta: {
        access_token: token,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const token = getToken(req);
  if (!token) {
    throw new Error("Authorization token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_STRING!) as DecodedType;
    const userID = decoded.id;

    const user = await UserModel.findOne({ id: userID });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    res.status(200).json({
      status: true,
      content: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
