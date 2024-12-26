import express from "express";
import { createSession, getAllSessions, joinSession,changeCode,endSession ,leaveSession} from "../controllers/session.controller.js";
import { protectedRoute } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get('/',protectedRoute,getAllSessions);
router.post('/',protectedRoute,createSession);
router.post('/:id',protectedRoute,joinSession);
router.post('/changeCode/:id',protectedRoute,changeCode);
router.post('/leaveSession/:id',protectedRoute,leaveSession)
router.delete('/endSession/:id',protectedRoute,endSession);



export default router;
