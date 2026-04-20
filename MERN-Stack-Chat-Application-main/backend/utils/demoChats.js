import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

const DEMO_USERS = [
	{
		fullName: "Support Team",
		username: "__demo_support__",
		gender: "male",
		profilePic: "https://i.pravatar.cc/150?img=12",
	},
	{
		fullName: "Project Buddy",
		username: "__demo_buddy__",
		gender: "female",
		profilePic: "https://i.pravatar.cc/150?img=47",
	},
	{
		fullName: "HR Updates",
		username: "__demo_hr__",
		gender: "female",
		profilePic: "https://i.pravatar.cc/150?img=32",
	},
];

const DEMO_PASSWORD = "demo_user_password_do_not_use";

const ensureDemoUsers = async () => {
	const demoUsers = [];
	for (const u of DEMO_USERS) {
		const existing = await User.findOne({ username: u.username });
		if (existing) {
			demoUsers.push(existing);
			continue;
		}

		const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
		const created = await User.create({
			fullName: u.fullName,
			username: u.username,
			password: hashedPassword,
			gender: u.gender,
			profilePic: u.profilePic,
		});
		demoUsers.push(created);
	}
	return demoUsers;
};

const seedConversationIfMissing = async ({ userId, demoUser, messages }) => {
	let conversation = await Conversation.findOne({
		participants: { $all: [userId, demoUser._id] },
	});

	if (!conversation) {
		conversation = await Conversation.create({
			participants: [userId, demoUser._id],
			messages: [],
		});
	}

	if (conversation.messages.length > 0) return;

	for (const msg of messages) {
		const senderId = msg.from === "me" ? userId : demoUser._id;
		const receiverId = msg.from === "me" ? demoUser._id : userId;
		const savedMessage = await Message.create({
			senderId,
			receiverId,
			message: msg.text,
			status: "read",
		});
		conversation.messages.push(savedMessage._id);
	}

	await conversation.save();
};

export const ensureDemoChatsForUser = async (userId) => {
	const enabled = process.env.ENABLE_DEMO_CHATS === "true";
	if (!enabled) return;

	const demoUsers = await ensureDemoUsers();

	// If the user already has ANY conversation, don’t seed.
	const existingConversation = await Conversation.exists({ participants: userId });
	if (existingConversation) return;

	const [support, buddy, hr] = demoUsers;

	await seedConversationIfMissing({
		userId,
		demoUser: support,
		messages: [
			{ from: "them", text: "Hi! I’m Support Team. This is a demo chat." },
			{ from: "them", text: "You can start messaging real users anytime." },
		],
	});

	await seedConversationIfMissing({
		userId,
		demoUser: buddy,
		messages: [
			{ from: "them", text: "Hey! Want to test emojis, voice notes, and attachments here?" },
			{ from: "them", text: "These chats stay in MongoDB, so they don’t disappear on refresh." },
		],
	});

	await seedConversationIfMissing({
		userId,
		demoUser: hr,
		messages: [
			{ from: "them", text: "Welcome aboard! Here are a few onboarding tips." },
			{ from: "them", text: "Tip: Update your profile picture from the Profile page." },
		],
	});
};

