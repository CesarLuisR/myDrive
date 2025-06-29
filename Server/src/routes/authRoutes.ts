import { Router } from "express";
import * as authCtrl from "../controllers/authCtrl";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.post("/signup", authCtrl.signUp);
router.post("/login", authCtrl.logIn);
router.post("/load", authenticateToken, authCtrl.load);

export default router;