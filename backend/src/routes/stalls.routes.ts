import { Router } from "express";
import { authRequired } from "../middleware/auth";
import { getAll, getAvailable } from "../controllers/stalls.controller";
import { body, param } from "express-validator";
import { validate } from "../middleware/validate";

const r = Router();

r.get("/", authRequired, getAll);
r.get("/available", authRequired, getAvailable);


export default r;
