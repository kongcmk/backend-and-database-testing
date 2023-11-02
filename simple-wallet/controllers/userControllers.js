const User = require("../models/user");

// User
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ error: "User id not provided" });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.isDeactivated === true) {
            return res.status(404).json({ error: "User was deactivated" }); // Corrected from 404 to indicate "User was deactivated"
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Create User
exports.createUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const usernameIsExist = await User.findOne({
            where: {
                username: username
            }
        });

        if (usernameIsExist) {
            return res.status(400).json({error: 'Username Existing'})
        }

        const newUser = await User.create({
            username,
            password
        });

        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, password } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID not provided" });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (username) {
            user.username = username;
        }

        if (password) {
            user.password = password;
        }

        await user.save();

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete User by soft delete
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ error: "User ID not provided" });
        }

        const user = await User.findOne({
            where: {
                id: userId,
                isDeactivated: false
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.isDeactivated = true;

        await user.save();

        return res.status(200).json({ message: 'Account was deactivated' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
