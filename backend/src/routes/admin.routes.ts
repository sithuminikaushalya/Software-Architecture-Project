// backend/src/routes/admin.routes.ts
import { Router } from "express";
import { body } from "express-validator";
import { authRequired } from "../middleware/auth";
import { adminOnly } from "../middleware/roles";
import { validate } from "../middleware/validate";
import {
  createEmployee,
  listEmployees
} from "../controllers/admin.controller";

const r = Router();
r.use(authRequired, adminOnly);

r.post(
  "/employees",
  body("businessName").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("contactPerson").notEmpty(),
  body("phone").notEmpty(),
  body("address").notEmpty(),
  validate,
  createEmployee
);

r.get("/employees", listEmployees);


export default r;
