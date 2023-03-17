import { NextFunction, Request, Response } from "express";
import validator from "validator";
import { Snowflake } from "@theinternetfolks/snowflake";
import { CommunityModel } from "../models/communityModel";
import { MemberModel } from "../models/memberModel";
import { UserModel } from "../models/userModel";
import { RoleModel } from "../models/roleModel";
import { getIdFromToken } from "../utils/getIdFromToken";
import { createErrMessage } from "../utils/errors";

export const createCommunity = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const slug = name.toLowerCase();
  const created_at = new Date().toISOString();
  const id = Snowflake.generate();

  const errorArray = [];
  try {
    const userID = getIdFromToken(req);

    //validate
    if (!validator.isLength(name, { min: 2 })) {
      const err = createErrMessage({ code: "INVALID_INPUT", param: "name" });
      errorArray.push(err);
    }
    if (errorArray.length > 0) return next(errorArray);

    const community = await CommunityModel.create({
      id: id,
      name: name,
      slug: slug,
      owner: userID,
      created_at: created_at,
      updated_at: created_at,
    });

    res.status(200).json({
      status: true,
      content: community,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAllCommunity = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skipIndex = (page - 1) * limit;
    const total = await CommunityModel.countDocuments();
    const communities = await CommunityModel.find().limit(limit).skip(skipIndex);

    const modifiedCommunities = communities.map((community) => ({
      id: community.id,
      name: community.name,
      slug: community.slug,
      owner: community.owner,
      created_at: community.created_at,
      updated_at: community.updated_at,
    }));

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: total,
          pages: Math.ceil(total / limit),
          page: page,
        },
        data: modifiedCommunities,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAllCommunityMembers = async (req: Request, res: Response) => {
  if (!req.params.id) return res.status(400).json({ message: "id is required" });
  const communityId = req.params.id;

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skipIndex = (page - 1) * limit;
    const total = await MemberModel.countDocuments({ community: communityId });
    const membersData = await MemberModel.find({ community: communityId });

    const modifiedCommunities: any = [];

    for (const memberData of membersData) {
      const userData = await UserModel.findOne({ id: memberData.user });
      if (!userData) return res.status(400).json({ message: "user not found" });

      const roleData = await RoleModel.findOne({ id: memberData.role });
      if (!roleData) return res.status(400).json({ message: "role not found" });

      const singleData = {
        id: memberData.id,
        community: memberData.community,
        user: {
          id: userData.id,
          name: userData.name,
        },
        role: {
          id: roleData.id,
          name: roleData.name,
        },
        created_at: memberData.created_at,
      };
      modifiedCommunities.push(singleData);
    }

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: total,
          pages: Math.ceil(total / limit),
          page: page,
        },
        data: modifiedCommunities,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const getMyOwnedCommunity = async (req: Request, res: Response) => {
  try {
    const userID = getIdFromToken(req);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skipIndex = (page - 1) * limit;
    const total = await CommunityModel.countDocuments();

    const myCommunities = await CommunityModel.find({ owner: userID });
    const modifiedMyCommunities = myCommunities.map((community) => ({
      id: community.id,
      name: community.name,
      slug: community.slug,
      owner: community.owner,
      created_at: community.created_at,
      updated_at: community.updated_at,
    }));

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: total,
          pages: Math.ceil(total / limit),
          page: page,
        },
        data: modifiedMyCommunities,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const getMyJoinedCommunity = async (req: Request, res: Response) => {
  try {
    const userID = getIdFromToken(req);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skipIndex = (page - 1) * limit;
    const total = await MemberModel.countDocuments({ user: userID });
    const memberships = await MemberModel.find({ user: userID });

    const communityIDs = memberships.map((membership) => membership.community);

    const modifiedCommunities: any = [];

    for (const community of communityIDs) {
      const communityData = await CommunityModel.findOne({ id: community });
      if (!communityData) return res.status(400).json({ message: "community not found" });

      const owner = await UserModel.findOne({ id: communityData.owner });
      if (!owner) return res.status(400).json({ message: "owner not found" });

      const singleData = {
        id: community,
        name: communityData.name,
        slug: communityData.slug,
        owner: {
          id: owner.id,
          name: owner.name,
        },
        created_at: communityData.created_at,
        updated_at: communityData.updated_at,
      };
      modifiedCommunities.push(singleData);
    }

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: total,
          pages: Math.ceil(total / limit),
          page: page,
        },
        data: modifiedCommunities,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
