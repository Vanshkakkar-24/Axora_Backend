import express from "express";
import { signupUser, loginUser, getCurrentUser } from "../controllers/authController.js";
import {authenticate} from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/me", authenticate, getCurrentUser);

export default router;