import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUrls } from "../controller/user-url.controller.js";
const router = express.Router();

router.post('/urls', authMiddleware , getUrls);


export default router;