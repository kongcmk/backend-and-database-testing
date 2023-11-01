const User = require("../models/user");

// User list
exports.getUserAll = async (req, res) => {
  try {
    const adminId = req.params.adminId;

    if (!adminId) {
      return res.status(400).json({ error: "Admin id not provided" });
    }

    const admin = await User.findByPk(adminId);

    if (!admin || admin.isAdmin !== true) {
      return res.status(400).json({ error: "You are not an admin" });
    }

    const userList = await User.findAll();
    return res.status(200).json(userList);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//create admin
exports.createAdmin = async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    if (!username || !password || !isAdmin) {
      return res
        .status(400)
        .json({ error: "Username and password or isAdmin are required" });
    }

    const newAdmin = await User.create({
      username,
      password,
      isAdmin,
    });

    return res.status(201).json(newAdmin);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//delete user by admin
exports.deleteUser = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const userId = req.body.userId;

    const admin = await User.findOne({
      where: {
        id: adminId,
        isAdmin: true,
      },
    });

    if (!adminId || !admin) {
      return res.status(400).json({ error: "You not admin" });
    }

    if (!userId) {
      return res.status(400).json({ error: "userId not provided" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isDeactivated = true;

    await user.save();

    return res.status(200).json({ message: "User account was deactivated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
