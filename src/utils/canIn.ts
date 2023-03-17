import { Request } from "express";
import { MemberModel } from "../models/memberModel";
import { getIdFromToken } from "./getIdFromToken";
import { RoleModel } from "../models/roleModel";

export const getIDs = async () => {
  const adminData = await RoleModel.find({ name: "Community Admin" });
  const ADMIN_ID = adminData.map((a) => a.id)[0];

  const modData = await RoleModel.find({ name: "Community Moderator" });
  const MOD_ID = modData.map((m) => m.id)[0];

  return { ADMIN_ID, MOD_ID };
};

export const canAddIn = async (req: Request) => {
  const userId = getIdFromToken(req);
  const { ADMIN_ID } = await getIDs();

  const memberships = await MemberModel.find({
    $and: [{ user: userId }, { role: ADMIN_ID }],
  });
  const communityIds = memberships.map((m) => m.community);

  return communityIds;
};

export const canRemoveIn = async (req: Request) => {
  const signedInUserId = getIdFromToken(req);
  const { ADMIN_ID, MOD_ID } = await getIDs();

  const memberships = await MemberModel.find({
    $and: [
      { user: signedInUserId },
      {
        $or: [{ role: ADMIN_ID }, { role: MOD_ID }],
      },
    ],
  });

  const communityIds = memberships.map((m) => m.community);

  return communityIds;
};
