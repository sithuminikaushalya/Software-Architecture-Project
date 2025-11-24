import { Router } from "express";
import authRoutes from "./auth.routes";
import stallsRoutes from "./stalls.routes";
import reservationsRoutes from "./reservations.routes";
import usersRoutes from "./users.routes";
import adminRoutes from "./admin.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/stalls", stallsRoutes);
router.use("/reservations", reservationsRoutes);
router.use("/users", usersRoutes);
router.use("/admin", adminRoutes);

export default router;
