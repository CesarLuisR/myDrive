import { TokenPayload } from "../utils/token";
import { Multer } from 'multer';

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
            file?: Multer.File;
        }
    }
}