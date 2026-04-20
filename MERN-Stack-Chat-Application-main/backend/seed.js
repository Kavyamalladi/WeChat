import User from "./models/user.model.js";
import Conversation from "./models/conversation.model.js";
import Message from "./models/message.model.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seedUsers = async () => {
	try {
		await connectToMongoDB();

		const users = [
			{
				fullName: "Alice Johnson",
				username: "alice",
				password: "password123",
				gender: "female",
				profilePic: "https://i.pravatar.cc/150?img=47",
			},
			{
				fullName: "Bob Smith",
				username: "bob",
				password: "password123",
				gender: "male",
				profilePic: "https://i.pravatar.cc/150?img=12",
			},
			{
				fullName: "Charlie Brown",
				username: "charlie",
				password: "password123",
				gender: "male",
				profilePic: "https://i.pravatar.cc/150?img=14",
			},
			{
				fullName: "Diana Prince",
				username: "diana",
				password: "password123",
				gender: "female",
				profilePic: "https://i.pravatar.cc/150?img=32",
			},
			{
				fullName: "Eve Adams",
				username: "eve",
				password: "password123",
				gender: "female",
				profilePic: "https://i.pravatar.cc/150?img=5",
			},
			{
				fullName: "Frank Miller",
				username: "frank",
				password: "password123",
				gender: "male",
				profilePic: "https://i.pravatar.cc/150?img=64",
			},
			{
				fullName: "Grace Chen",
				username: "grace",
				password: "password123",
				gender: "female",
				profilePic: "https://i.pravatar.cc/150?img=26",
			},
			{
				fullName: "Henry Wilson",
				username: "henry",
				password: "password123",
				gender: "male",
				profilePic: "https://i.pravatar.cc/150?img=67",
			},
			{
				fullName: "Iris Martinez",
				username: "iris",
				password: "password123",
				gender: "female",
				profilePic: "https://i.pravatar.cc/150?img=19",
			},
			{
				fullName: "Jack Taylor",
				username: "jack",
				password: "password123",
				gender: "male",
				profilePic: "https://i.pravatar.cc/150?img=68",
			},
			{
				fullName: "Kate Anderson",
				username: "kate",
				password: "password123",
				gender: "female",
				profilePic: "https://i.pravatar.cc/150?img=3",
			},
			{
				fullName: "Leo Garcia",
				username: "leo",
				password: "password123",
				gender: "male",
				profilePic: "https://i.pravatar.cc/150?img=41",
			},
			{
				fullName: "Maya Patel",
				username: "maya",
				password: "password123",
				gender: "female",
				profilePic: "https://i.pravatar.cc/150?img=44",
			},
			{
				fullName: "Noah Rodriguez",
				username: "noah",
				password: "password123",
				gender: "male",
				profilePic: "https://i.pravatar.cc/150?img=69",
			},
			{
				fullName: "Olivia Kim",
				username: "olivia",
				password: "password123",
				gender: "female",
				profilePic: "https://i.pravatar.cc/150?img=49",
			},
		];

		const seededUsersByUsername = {};
		for (const user of users) {
			const hashedPassword = await bcrypt.hash(user.password, 10);
			const savedUser = await User.findOneAndUpdate(
				{ username: user.username },
				{
					$set: {
						fullName: user.fullName,
						gender: user.gender,
						profilePic: user.profilePic,
					},
					$setOnInsert: {
						username: user.username,
						password: hashedPassword,
					},
				},
				{ upsert: true, new: true, setDefaultsOnInsert: true }
			);

			seededUsersByUsername[user.username] = savedUser;
		}

		const demoConversationSeeds = [
			{
				userA: "alice",
				userB: "bob",
				messages: [
					{ sender: "alice", text: "Hey Bob, welcome to the demo chat!" },
					{ sender: "bob", text: "Thanks Alice. This looks great and stays after refresh." },
					{ sender: "alice", text: "How's your day going?" },
					{ sender: "bob", text: "Pretty good! Working on some new projects." },
				],
			},
			{
				userA: "alice",
				userB: "diana",
				messages: [
					{ sender: "diana", text: "Hi Alice! Testing profile pictures and chats." },
					{ sender: "alice", text: "Perfect. Everything is now seeded in MongoDB." },
					{ sender: "diana", text: "The new features look amazing!" },
					{ sender: "alice", text: "Thanks! We worked hard on them." },
				],
			},
			{
				userA: "alice",
				userB: "charlie",
				messages: [
					{ sender: "charlie", text: "Hey Alice, did you see the latest updates?" },
					{ sender: "alice", text: "Yes! The new UI is fantastic." },
					{ sender: "charlie", text: "I love the dark mode feature." },
				],
			},
			{
				userA: "alice",
				userB: "eve",
				messages: [
					{ sender: "eve", text: "Alice! Long time no see!" },
					{ sender: "alice", text: "Eve! How have you been?" },
					{ sender: "eve", text: "Great! Just got back from vacation." },
					{ sender: "alice", text: "That sounds wonderful! Where did you go?" },
				],
			},
			{
				userA: "bob",
				userB: "frank",
				messages: [
					{ sender: "bob", text: "Frank, are you coming to the meeting?" },
					{ sender: "frank", text: "Yes, I'll be there in 10 minutes." },
					{ sender: "bob", text: "Perfect, we're starting soon." },
				],
			},
			{
				userA: "bob",
				userB: "grace",
				messages: [
					{ sender: "grace", text: "Bob, can you help me with the project?" },
					{ sender: "bob", text: "Sure! What do you need help with?" },
					{ sender: "grace", text: "The database queries are giving me trouble." },
					{ sender: "bob", text: "I can take a look at them." },
				],
			},
			{
				userA: "charlie",
				userB: "henry",
				messages: [
					{ sender: "henry", text: "Charlie, lunch today?" },
					{ sender: "charlie", text: "Sounds good! 12:30?" },
					{ sender: "henry", text: "Perfect, see you then!" },
				],
			},
			{
				userA: "charlie",
				userB: "iris",
				messages: [
					{ sender: "iris", text: "Hey Charlie! How's the new project?" },
					{ sender: "charlie", text: "It's going well, almost done!" },
					{ sender: "iris", text: "That's great! Need any help?" },
					{ sender: "charlie", text: "Thanks, but I think I've got it covered." },
				],
			},
			{
				userA: "diana",
				userB: "jack",
				messages: [
					{ sender: "jack", text: "Diana, did you review my code?" },
					{ sender: "diana", text: "Yes, looks good to me!" },
					{ sender: "jack", text: "Thanks for the quick review." },
					{ sender: "diana", text: "No problem, happy to help!" },
				],
			},
			{
				userA: "diana",
				userB: "kate",
				messages: [
					{ sender: "kate", text: "Diana, coffee break?" },
					{ sender: "diana", text: "I'd love to! 3 PM?" },
					{ sender: "kate", text: "Perfect, see you at the usual spot." },
				],
			},
			{
				userA: "eve",
				userB: "leo",
				messages: [
					{ sender: "leo", text: "Eve, are you free this weekend?" },
					{ sender: "eve", text: "Yes, what's up?" },
					{ sender: "leo", text: "Thinking about going hiking." },
					{ sender: "eve", text: "Count me in!" },
				],
			},
			{
				userA: "frank",
				userB: "maya",
				messages: [
					{ sender: "maya", text: "Frank, can you send me the report?" },
					{ sender: "frank", text: "Sure, sending it now." },
					{ sender: "maya", text: "Got it, thanks!" },
					{ sender: "frank", text: "Let me know if you need anything else." },
				],
			},
			{
				userA: "grace",
				userB: "noah",
				messages: [
					{ sender: "noah", text: "Grace, how's the new design coming along?" },
					{ sender: "grace", text: "It's looking great! Almost finished." },
					{ sender: "noah", text: "Can't wait to see the final version!" },
				],
			},
			{
				userA: "henry",
				userB: "olivia",
				messages: [
					{ sender: "olivia", text: "Henry, did you get my email?" },
					{ sender: "henry", text: "Yes, I'll respond by end of day." },
					{ sender: "olivia", text: "Thanks! No rush though." },
				],
			},
			{
				userA: "iris",
				userB: "leo",
				messages: [
					{ sender: "iris", text: "Leo, great presentation today!" },
					{ sender: "leo", text: "Thanks Iris! I was nervous." },
					{ sender: "iris", text: "You did amazing! Everyone loved it." },
					{ sender: "leo", text: "That means a lot, thank you!" },
				],
			},
		];

		for (const seed of demoConversationSeeds) {
			const userA = seededUsersByUsername[seed.userA];
			const userB = seededUsersByUsername[seed.userB];
			if (!userA || !userB) continue;

			let conversation = await Conversation.findOne({
				participants: { $all: [userA._id, userB._id] },
			});

			if (!conversation) {
				conversation = await Conversation.create({
					participants: [userA._id, userB._id],
					messages: [],
				});
			}

			const hasMessages = await Message.exists({
				$or: [
					{ senderId: userA._id, receiverId: userB._id },
					{ senderId: userB._id, receiverId: userA._id },
				],
			});

			if (!hasMessages) {
				for (const msg of seed.messages) {
					const sender = seededUsersByUsername[msg.sender];
					const receiver = sender.username === seed.userA ? userB : userA;

					const savedMessage = await Message.create({
						senderId: sender._id,
						receiverId: receiver._id,
						message: msg.text,
						status: "read",
					});

					conversation.messages.push(savedMessage._id);
				}

				await conversation.save();
			}
		}

		console.log("Demo users and chats seeded successfully");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding demo data:", error);
		process.exit(1);
	}
};

seedUsers();