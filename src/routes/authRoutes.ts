import express from "express";
const router = express.Router();
import { authCheck, login, register } from "../controllers/authControllers";

router.post("/login", login);
router.post("/register", register);

router.get("/authCheck", authCheck);

export { router as authRouter };
