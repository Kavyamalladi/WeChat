import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateUser = async (req, res) => {
	try {
		const { fullName, username, gender, profilePic } = req.body;
		const userId = req.user._id;

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ fullName, username, gender, profilePic },
			{ new: true, runValidators: true }
		).select("-password");

		if (!updatedUser) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json(updatedUser);
	} catch (error) {
		console.error("Error in updateUser: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
