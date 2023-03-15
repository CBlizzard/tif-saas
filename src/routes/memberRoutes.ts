import express from "express";
const router = express.Router();
import { addMember, removeMember } from "../controllers/memberControllers";

router.post("/member", addMember);
router.delete("/member/:id", removeMember);

export default router;
