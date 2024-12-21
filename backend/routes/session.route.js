import express from "express";
import { createSession, getAllSessions, joinSession } from "../controllers/session.controller.js";
import { protectedRoute } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get('/',protectedRoute,getAllSessions);
router.post('/',protectedRoute,createSession);
router.post('/:id',protectedRoute,joinSession);



export default router;
