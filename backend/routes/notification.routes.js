import express from "express";
import { protectRoutes } from "../middleware/protectRoute.js";
import { deleteNotification, deleteSingleNotification, getNotification } from "../controller/notification.controller.js";

const router = express.Router();


router.get('/', protectRoutes, getNotification)

router.delete('/', protectRoutes, deleteNotification)

router.delete('/:id', protectRoutes, deleteSingleNotification)
export default router;
