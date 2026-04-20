import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import VoiceMessagePlayer from "./VoiceMessagePlayer";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation, messages, setMessages } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";
	const [showReactions, setShowReactions] = useState(false);

	const getStatusIcon = (status) => {
		switch (status) {
			case "sent":
				return "✓";
			case "delivered":
				return "✓✓";
			case "read":
				return "✓✓";
			default:
				return "";
		}
	};

	const handleReaction = async (emoji) => {
		try {
			const res = await fetch(`/api/messages/react/${message._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ emoji }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			setMessages(
				messages.map((msg) => {
					if (msg._id !== message._id) return msg;

					const reactions = Array.isArray(msg.reactions) ? [...msg.reactions] : [];
					const existingReactionIndex = reactions.findIndex(
						(reaction) => reaction.userId?.toString() === authUser._id.toString()
					);

					if (existingReactionIndex >= 0) {
						reactions[existingReactionIndex] = {
							...reactions[existingReactionIndex],
							emoji,
						};
					} else {
						reactions.push({ userId: authUser._id, emoji });
					}

					return { ...msg, reactions };
				})
			);
		} catch (error) {
			console.error(error);
		}
		setShowReactions(false);
	};

	const handleDelete = async () => {
		try {
			const res = await fetch(`/api/messages/${message._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			setMessages(messages.filter(m => m._id !== message._id));
		} catch (error) {
			console.error(error);
		}
	};

	const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} pb-2 relative`}>
				{message.voiceMessage && (
					<div className='mb-2'>
						<VoiceMessagePlayer 
							audioURL={message.voiceMessage} 
							duration={message.voiceDuration || 0}
							sender={fromMe}
						/>
					</div>
				)}
				{message.attachments && message.attachments.length > 0 && (
					<div className='mb-2'>
						{message.attachments.map((attachment, index) => (
							<div key={index} className='mb-1'>
								{attachment.type === 'image' ? (
									<img src={attachment.url} alt={attachment.filename} className='max-w-48 rounded' />
								) : (
									<a href={attachment.url} target='_blank' rel='noopener noreferrer' className='text-blue-300 underline'>
										{attachment.filename}
									</a>
								)}
							</div>
						))}
					</div>
				)}
				{message.message && (
					<div>{message.message}</div>
				)}
				{fromMe && (
					<button
						onClick={handleDelete}
						className='absolute -top-2 -left-2 bg-red-600 rounded-full p-1 text-xs'
					>
						<MdDelete size={12} />
					</button>
				)}
				<button
					onClick={() => setShowReactions(!showReactions)}
					className='absolute -bottom-2 -right-2 bg-gray-600 rounded-full p-1 text-xs'
				>
					+
				</button>
				{showReactions && (
					<div className='absolute bottom-6 right-0 bg-gray-700 rounded p-2 flex gap-1'>
						{reactions.map(emoji => (
							<button key={emoji} onClick={() => handleReaction(emoji)} className='text-lg'>
								{emoji}
							</button>
						))}
					</div>
				)}
			</div>
			{message.reactions && message.reactions.length > 0 && (
				<div className='flex gap-1 mt-1'>
					{message.reactions.map((reaction, index) => (
						<span key={index} className='text-sm bg-gray-600 rounded px-1'>
							{reaction.emoji}
						</span>
					))}
				</div>
			)}
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
				{formattedTime}
				{fromMe && <span className={message.status === "read" ? "text-blue-400" : ""}>{getStatusIcon(message.status)}</span>}
			</div>
		</div>
	);
};
export default Message;
