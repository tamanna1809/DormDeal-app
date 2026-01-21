import Item from "../models/Item.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";


// CREATE ITEM
export const createItem = async (req, res) => {
  try {
    const item = await Item.create({
      ...req.body,
      sellerId: req.user.userId,
    });

    // Create notifications for all other users after item is created
    const users = await User.find({ _id: { $ne: req.user.userId } });
    if (users.length > 0) {
      await Notification.insertMany(
        users.map((user) => ({
          title: "New item added",
          message: `${item.title} is now available`,
          userId: user._id,
          itemId: item._id,
        }))
      );
    }

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL ITEMS (DASHBOARD)
export const getItems = async (req, res) => {
  const items = await Item.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .populate("sellerId", "name roomNumber phoneNumber year");
  res.json(items);
};

// GET ITEM BY ID
export const getItemById = async (req, res) => {
  const item = await Item.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
    .populate("sellerId", "name roomNumber phoneNumber year");
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
};

// UPDATE ITEM (OWNER ONLY)
export const updateItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  if (item.sellerId.toString() !== req.user.userId)
    return res.status(403).json({ message: "Not allowed" });

  Object.assign(item, req.body);
  await item.save();
  res.json(item);
};

// MARK AS SOLD
export const markSold = async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item)
    return res.status(404).json({ message: "Item not found" });

  if (item.sellerId.toString() !== req.user.userId)
    return res.status(403).json({ message: "Not allowed" });

  item.status = "sold";
  await item.save();

  // Notify others that item is sold
  const users = await User.find({ _id: { $ne: req.user.userId } });
  if (users.length > 0) {
    await Notification.insertMany(
      users.map((user) => ({
        title: "Item Sold",
        message: `${item.title} has been sold`,
        userId: user._id,
        itemId: item._id,
      }))
    );
  }

  res.json(item);
};


// SOFT DELETE
export const deleteItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  if (item.sellerId.toString() !== req.user.userId && req.user.role !== "admin")
    return res.status(403).json({ message: "Not allowed" });

  item.isDeleted = true;
  await item.save();
  res.json({ message: "Item deleted" });
};
