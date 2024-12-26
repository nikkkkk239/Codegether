import express from "express";
import { login, register ,logout, checkAuth,getUser} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.post('/login',login);
router.post('/register',register);
router.post('/logout',logout);
router.get('/checkAuth',protectedRoute,checkAuth);
router.get('/getUser/:id',protectedRoute,getUser)

export default router;