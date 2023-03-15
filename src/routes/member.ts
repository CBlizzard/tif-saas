import express from "express";
const router = express.Router();
import { addMember, removeMember } from "../controllers/member";

router.post("/member", addMember);
router.delete("/member/:id", removeMember);

export default router;
