import express from "express";
const router = express.Router();
import { createRole, getAllRoles } from "../controllers/roleControllers";

router.post("/role", createRole);
router.get("/role", getAllRoles);

export default router;
