import dotenv from "dotenv";
import connectToMongoDB from "./db/connectToMongoDB.js";
import User from "./models/user.model.js";
import Conversation from "./models/conversation.model.js";
import Message from "./models/message.model.js";

dotenv.config();

const DEMO_USERNAMES = [
	"alice",
	"bob",
	"charlie",
	"diana",
	"eve",
	"frank",
	"grace",
	"henry",
	"iris",
	"jack",
	"kate",
	"leo",
	"maya",
	"noah",
	"olivia",
];

async function cleanup() {
	try {
		await connectToMongoDB();

		const demoUsers = await User.find({ username: { $in: DEMO_USERNAMES } }).select("_id username");
		const demoUserIds = demoUsers.map((u) => u._id);

		const deletedMessages = await Message.deleteMany({
			$or: [{ senderId: { $in: demoUserIds } }, { receiverId: { $in: demoUserIds } }],
		});

		const deletedConversations = await Conversation.deleteMany({
			participants: { $in: demoUserIds },
		});

		const deletedUsers = await User.deleteMany({ _id: { $in: demoUserIds } });

		console.log(
			JSON.stringify(
				{
					demoUsersFound: demoUsers.map((u) => u.username),
					deleted: {
						users: deletedUsers.deletedCount,
						conversations: deletedConversations.deletedCount,
						messages: deletedMessages.deletedCount,
					},
				},
				null,
				2
			)
		);

		process.exit(0);
	} catch (error) {
		console.error("Cleanup failed:", error);
		process.exit(1);
	}
}

cleanup();

