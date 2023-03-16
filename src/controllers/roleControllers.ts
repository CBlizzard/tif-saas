import { Request, Response } from "express";
import { RoleModel } from "../models/roleModel";
import validator from "validator";
import { Snowflake } from "@theinternetfolks/snowflake";

export const createRole = async (req: Request, res: Response) => {
  const { name } = req.body;
  const created_at = new Date().toISOString();
  const id = Snowflake.generate();

  try {
    //validate
    if (!name) {
      return res.status(400).json({ message: "please give name to the role" });
    }

    if (!validator.isLength(name, { min: 2 })) {
      return res.status(400).json({ message: "minimum 2 characters required in name" });
    }

    // create role
    const role = await RoleModel.create({ id, name, created_at, updated_at: created_at });

    res.status(200).json({
      status: true,
      content: {
        id: id,
        name: name,
        created_at: created_at,
        updated_at: created_at,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skipIndex = (page - 1) * limit;
    const total = await RoleModel.countDocuments();
    const roles = await RoleModel.find().limit(limit).skip(skipIndex);

    const modifiedRolesArray = roles.map((role) => ({
      id: role.id,
      name: role.name,
      scope: role.scope,
      created_at: role.created_at,
      updated_at: role.updated_at,
    }));

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: total,
          pages: Math.ceil(total / limit),
          page: page,
        },
        data: modifiedRolesArray,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
