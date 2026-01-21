import User from "../models/User.js";

// UPDATE CURRENT USER PROFILE (phoneNumber, roomNumber, year)
export const updateMe = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { phoneNumber, roomNumber, year } = req.body;

    const updates = {};
    if (typeof phoneNumber === "string") updates.phoneNumber = phoneNumber.trim();
    if (typeof roomNumber === "string") updates.roomNumber = roomNumber.trim();
    if (typeof year === "string") updates.year = year.trim();

    // Basic validation
    if (
      (updates.phoneNumber !== undefined && updates.phoneNumber.length === 0) ||
      (updates.roomNumber !== undefined && updates.roomNumber.length === 0) ||
      (updates.year !== undefined && updates.year.length === 0)
    ) {
      return res.status(400).json({ message: "Fields cannot be empty" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

