import express from "express";
const router = express.Router();
import { signUp, signIn, getMe } from "../controllers/userControllers";

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/me", getMe);

export default router;
