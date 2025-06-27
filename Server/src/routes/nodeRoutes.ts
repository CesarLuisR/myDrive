import { Router } from "express"
import * as nodeCtrl from "../controllers/nodeCtrl";
import { upload } from "../middlewares/multer";

const router = Router();

router.post("/", upload.single("file"), nodeCtrl.createNode);

export default router;