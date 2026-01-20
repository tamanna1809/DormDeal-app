import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  markSold,
  deleteItem,
} from "../controllers/item.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createItem);
router.get("/", getItems);
router.get("/:id", getItemById);
router.put("/:id", authMiddleware, updateItem);
router.patch("/:id/sold", authMiddleware, markSold);
router.delete("/:id", authMiddleware, deleteItem);

export default router;
