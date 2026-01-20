import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/admin.middleware.js";
import User from "../models/User.js";
import Item from "../models/Item.js";

const router = express.Router();

// VIEW ALL USERS
router.get("/users", authMiddleware, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// VIEW ALL ITEMS (INCLUDING DELETED)
router.get("/items", authMiddleware, adminOnly, async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// DELETE ITEM (ADMIN)
router.delete("/items/:id", authMiddleware, adminOnly, async (req, res) => {
  await Item.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.json({ message: "Item removed by admin" });
});

export default router;
