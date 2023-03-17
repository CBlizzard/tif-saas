import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { CommunityModel } from "../models/communityModel";
import { RoleModel } from "../models/roleModel";
import { MemberModel } from "../models/memberModel";
import { Snowflake } from "@theinternetfolks/snowflake";
import { canAddIn, canRemoveIn } from "../utils/canIn";
import { createErrMessage } from "../utils/errors";

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
  const { community, user, role } = req.body;
  const created_at = new Date().toISOString();
  const id = Snowflake.generate();

  const errorArray = [];

  try {
    // validate
    const communityExists = await CommunityModel.findOne({ id: community });
    if (!communityExists) {
      const err = createErrMessage({ code: "RESOURCE_NOT_FOUND", param: "community" });
      errorArray.push(err);
    }

    const userExits = await UserModel.findOne({ id: user });
    if (!userExits) {
      const err = createErrMessage({ code: "RESOURCE_NOT_FOUND", param: "user" });
      errorArray.push(err);
    }

    const roleExists = await RoleModel.findOne({ id: role });
    if (!roleExists) {
      const err = createErrMessage({ code: "RESOURCE_NOT_FOUND", param: "role" });
      errorArray.push(err);
    }

    const userAlreadyAMember = await MemberModel.findOne({ community: community, user: user });
    if (userAlreadyAMember) {
      const err = createErrMessage({ code: "RESOURCE_EXISTS" });
      errorArray.push(err);
    }

    const canAddInCommunities = await canAddIn(req);
    if (!canAddInCommunities.includes(community)) {
      const err = createErrMessage({ code: "NOT_ALLOWED_ACCESS" });
      errorArray.push(err);
    }

    if (errorArray.length > 0) return next(errorArray);

    // Add member
    const member = await MemberModel.create({
      id: id,
      community: community,
      user: user,
      role: role,
      created_at: created_at,
    });

    res.status(200).json({
      status: true,
      content: {
        data: member,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id) return res.status(400).json({ message: "id is required" });
  const userIdToDelete = req.params.id;

  const errorArray = [];
  try {
    const userExits = await UserModel.findOne({ id: userIdToDelete });
    if (!userExits) {
      const err = { code: "RESOURCE_NOT_FOUND" };
      errorArray.push(err);
    }

    const communitiesToRemoveFrom = await canRemoveIn(req);

    // +++++++
    // check if

    // +++++++

    if (errorArray.length > 0) return next(errorArray);

    for (const community of communitiesToRemoveFrom) {
      await MemberModel.deleteOne({ community: community, user: userIdToDelete });
    }

    res.status(200).json({
      status: true,
    });
  } catch (err) {
    console.log(err);
  }
};
