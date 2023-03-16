import express from "express";
const router = express.Router();
import { createRole, getAllRoles } from "../controllers/roleControllers";

router.post("/", createRole);
router.get("/", getAllRoles);

export default router;
