import express from "express";
import { createSession, getAllSessions, joinSession,changeCode } from "../controllers/session.controller.js";
import { protectedRoute } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get('/',protectedRoute,getAllSessions);
router.post('/',protectedRoute,createSession);
router.post('/:id',protectedRoute,joinSession);
router.post('/changeCode/:id',protectedRoute,changeCode)



export default router;
