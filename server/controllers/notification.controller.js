import Notification from "../models/Notification.js";

// GET USER NOTIFICATIONS
export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user.userId,
  }).sort({ createdAt: -1 });

  res.json(notifications);
};

// MARK AS READ
export const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification)
    return res.status(404).json({ message: "Notification not found" });

  if (notification.userId.toString() !== req.user.userId)
    return res.status(403).json({ message: "Not allowed" });

  notification.isRead = true;
  await notification.save();

  res.json(notification);
};
