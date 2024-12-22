import express from "express"
import { protectedRoute } from "../middlewares/auth.middlewares.js";
import { sendMessage } from "../controllers/chat.controller.js";

const router = express.Router();

router.post('/:id',protectedRoute,sendMessage);

export default router;