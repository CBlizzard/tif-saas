import express from "express";
const router = express.Router();
import { addMember, removeMember } from "../controllers/memberControllers";

router.post("/", addMember);
router.delete("/:id", removeMember);

export default router;
