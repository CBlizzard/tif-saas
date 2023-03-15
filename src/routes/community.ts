import express from "express";
const router = express.Router();
import {
  createCommunity,
  getAllCommunity,
  getAllCommunityMembers,
  getMyOwnedCommunity,
  getMyJoinedCommunity,
} from "../controllers/community";

router.post("/community", createCommunity);
router.get("/community", getAllCommunity);
router.get("/community/:id/members", getAllCommunityMembers);
router.get("/community/me/owner", getMyOwnedCommunity);
router.get("/community/me/member", getMyJoinedCommunity);

export default router;
