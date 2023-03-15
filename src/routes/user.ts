import express from "express";
const router = express.Router();
import { signUp, signIn, getMe } from "../controllers/user";

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/me", getMe);

export default router;
