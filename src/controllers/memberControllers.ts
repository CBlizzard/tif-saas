import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { CommunityModel } from "../models/communityModel";
import { RoleModel } from "../models/roleModel";
import { MemberModel } from "../models/memberModel";
import { Snowflake } from "@theinternetfolks/snowflake";
import { canRemoveIn } from "../utils/canIn";

export const addMember = async (req: Request, res: Response) => {
  const { community, user, role } = req.body;
  const created_at = new Date().toISOString();
  const id = Snowflake.generate();

  try {
    // validate
    const communityExists = await CommunityModel.findOne({ id: community });
    if (!communityExists) {
      return res.status(400).json({ message: "community does not exist" });
    }

    const userExits = await UserModel.findOne({ id: user });
    if (!userExits) {
      return res.status(400).json({ message: "user does not exist" });
    }

    const roleExists = await RoleModel.findOne({ id: role });
    if (!roleExists) {
      return res.status(400).json({ message: "role does not exist" });
    }

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

export const removeMember = async (req: Request, res: Response) => {
  if (!req.params.id) return res.status(400).json({ message: "id is required" });
  const userIdToDelete = req.params.id;

  try {
    const communitiesToRemoveFrom = await canRemoveIn(req);

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
