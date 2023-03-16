import { Request } from "express";
import { MemberModel } from "../models/memberModel";
import { getIdFromToken } from "./getIdFromToken";

const ADMIN_ID = "7042071572520321459";
const MOD_ID = "7042071732140010545";

export const canAddIn = async (req: Request) => {
  const userId = getIdFromToken(req);

  const memberships = await MemberModel.find({
    $and: [{ user: userId }, { role: ADMIN_ID }],
  });
  const communityIds = memberships.map((m) => m.community);

  return communityIds;
};

export const canRemoveIn = async (req: Request) => {
  const userId = getIdFromToken(req);

  const memberships = await MemberModel.find({
    $and: [
      { user: userId },
      {
        $or: [{ role: ADMIN_ID }, { role: MOD_ID }],
      },
    ],
  });

  const communityIds = memberships.map((m) => m.community);

  return communityIds;
};
