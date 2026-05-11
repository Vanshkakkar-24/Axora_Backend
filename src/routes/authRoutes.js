import express from "express";

import {
  signupUser,
  loginUser,
} from "../controllers/authController.js";

import {authenticate} from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", authenticate, loginUser);

export default router;