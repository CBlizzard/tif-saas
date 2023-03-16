import express from "express";
const router = express.Router();
import {
  createCommunity,
  getAllCommunity,
  getAllCommunityMembers,
  getMyOwnedCommunity,
  getMyJoinedCommunity,
} from "../controllers/communityControllers";

router.post("/", createCommunity);
router.get("/", getAllCommunity);
router.get("/:id/members", getAllCommunityMembers);
router.get("/me/owner", getMyOwnedCommunity);
router.get("/me/member", getMyJoinedCommunity);

export default router;
