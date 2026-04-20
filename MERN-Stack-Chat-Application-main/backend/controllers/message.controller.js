import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const deleteMessage = async (req, res) => {
	try {
		const { messageId } = req.params;
		const userId = req.user._id;

		const message = await Message.findById(messageId);
		if (!message) {
			return res.status(404).json({ error: "Message not found" });
		}

		if (message.senderId.toString() !== userId.toString()) {
			return res.status(403).json({ error: "You can only delete your own messages" });
		}

		await Message.findByIdAndDelete(messageId);

		res.status(200).json({ message: "Message deleted" });
	} catch (error) {
		console.log("Error in deleteMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { message, voiceDuration } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const receiverSocketId = getReceiverSocketId(receiverId);
		const attachments = req.files && req.files.files ? req.files.files.map(file => ({
			filename: file.originalname,
			url: `/uploads/${file.filename}`,
			type: file.mimetype.startsWith('image/') ? 'image' : 'file',
		})) : [];

		// Handle voice message
		let voiceMessage = null;
		if (req.files && req.files.voiceMessage && req.files.voiceMessage.length > 0) {
			const voiceFile = req.files.voiceMessage[0];
			voiceMessage = `/uploads/${voiceFile.filename}`;
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message: message || "", // Ensure message is not undefined for voice messages
			status: receiverSocketId ? "delivered" : "sent",
			attachments,
			voiceMessage,
			voiceDuration: voiceDuration ? parseInt(voiceDuration) : 0,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// await conversation.save();
		// await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HERE
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const markAsRead = async (req, res) => {
	try {
		const { id: senderId } = req.params;
		const userId = req.user._id;

		await Message.updateMany(
			{ senderId, receiverId: userId, status: { $ne: "read" } },
			{ status: "read" }
		);

		res.status(200).json({ message: "Messages marked as read" });
	} catch (error) {
		console.log("Error in markAsRead controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const addReaction = async (req, res) => {
	try {
		const { messageId } = req.params;
		const { emoji } = req.body;
		const userId = req.user._id;

		const message = await Message.findById(messageId);
		if (!message) {
			return res.status(404).json({ error: "Message not found" });
		}

		const existingReaction = message.reactions.find(r => r.userId.toString() === userId.toString());
		if (existingReaction) {
			existingReaction.emoji = emoji;
		} else {
			message.reactions.push({ userId, emoji });
		}

		await message.save();

		const receiverSocketId = getReceiverSocketId(message.receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("reactionAdded", { messageId, userId, emoji });
		}

		res.status(200).json({ message: "Reaction added" });
	} catch (error) {
		console.log("Error in addReaction controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
