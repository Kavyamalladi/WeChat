import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			required: false,
		},
		status: {
			type: String,
			enum: ["sent", "delivered", "read"],
			default: "sent",
		},
		reactions: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				emoji: String,
			},
		],
		attachments: [
			{
				filename: String,
				url: String,
				type: String, // 'image' or 'file'
			},
		],
		voiceMessage: {
			type: String, // URL to voice file
			required: false,
		},
		voiceDuration: {
			type: Number, // Duration in seconds
			default: 0,
		},
		// createdAt, updatedAt
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
