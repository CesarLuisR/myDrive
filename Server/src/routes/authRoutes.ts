import { Router } from "express";
import * as authCtrl from "../controllers/authCtrl";

const router = Router();

router.post("/signup", authCtrl.signUp);
router.post("/login", authCtrl.logIn);

export default router;