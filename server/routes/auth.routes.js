import express from "express";
import { signup, login } from "../controllers/auth.controller.js";

// console.log("AUTH ROUTES FILE LOADED");


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
