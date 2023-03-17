import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import validator from "validator";
import { Snowflake } from "@theinternetfolks/snowflake";
import { UserModel } from "../models/userModel";
import { createToken } from "../utils/createToken";
import { getIdFromToken } from "../utils/getIdFromToken";
import { createErrMessage } from "../utils/errors";

// ======================
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  const created_at = new Date().toISOString();
  const id = Snowflake.generate();

  const errorArray = [];

  try {
    //validate
    if (!validator.isLength(name, { min: 2 })) {
      const err = createErrMessage({ code: "INVALID_INPUT", param: "name" });
      errorArray.push(err);
    }

    if (!validator.isLength(password, { min: 2 })) {
      const err = createErrMessage({ code: "INVALID_INPUT", param: "password" });
      errorArray.push(err);
    }

    if (!validator.isEmail(email)) {
      const err = createErrMessage({ code: "INVALID_INPUT", param: "email" });
      errorArray.push(err);
    }

    const userAlreadyExits = await UserModel.findOne({ email });
    if (userAlreadyExits) {
      const err = createErrMessage({ code: "RESOURCE_EXISTS", param: "email" });
      errorArray.push(err);
    }

    if (errorArray.length > 0) {
      return next(errorArray);
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

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const errorArray = [];
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      const err = createErrMessage({ code: "INVALID_INPUT", param: "email" });
      errorArray.push(err);
      return next(errorArray);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      const err = createErrMessage({ code: "INVALID_CREDENTIALS", param: "password" });
      errorArray.push(err);
      return next(errorArray);
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

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const errorArray = [];
  try {
    const userID = getIdFromToken(req);
    if (!userID) {
      const err = createErrMessage({ code: "NOT_SIGNEDIN" });
      errorArray.push(err);
      return next(errorArray);
    }

    const user = await UserModel.findOne({ id: userID });
    if (!user) {
      const err = createErrMessage({ code: "RESOURCE_NOT_FOUND", param: "user" });
      errorArray.push(err);
      return next(errorArray);
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
