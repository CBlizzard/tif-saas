import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import { Snowflake } from "@theinternetfolks/snowflake";
import { CommunityModel } from "../models/communityModel";
import { getIdFromToken } from "../utils/getIdFromToken";
import { idText } from "typescript";

export const createCommunity = async (req: Request, res: Response) => {
  const { name } = req.body;
  const slug = name.toLowerCase();
  const created_at = new Date().toISOString();
  const id = Snowflake.generate();

  try {
    const userID = getIdFromToken(req);

    //validate
    if (!name) {
      return res.status(400).json({ message: "please give name to the community" });
    }

    if (!validator.isLength(name, { min: 2 })) {
      return res.status(400).json({ message: "minimum 2 characters required in name" });
    }

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
  try {
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
  } catch (err) {
    console.log(err);
  }
};
