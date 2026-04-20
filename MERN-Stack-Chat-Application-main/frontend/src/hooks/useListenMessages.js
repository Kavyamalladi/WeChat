import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			const sound = new Audio(notificationSound);
			sound.play();
			setMessages([...messages, newMessage]);
		});

		socket?.on("reactionAdded", ({ messageId, userId, emoji }) => {
			setMessages(
				messages.map((msg) => {
					if (msg._id !== messageId) return msg;

					const reactions = Array.isArray(msg.reactions) ? [...msg.reactions] : [];
					const existingReactionIndex = reactions.findIndex(
						(reaction) => reaction.userId?.toString() === userId?.toString()
					);

					if (existingReactionIndex >= 0) {
						reactions[existingReactionIndex] = {
							...reactions[existingReactionIndex],
							emoji,
						};
					} else {
						reactions.push({ userId, emoji });
					}

					return { ...msg, reactions };
				})
			);
		});

		return () => {
			socket?.off("newMessage");
			socket?.off("reactionAdded");
		};
	}, [socket, setMessages, messages]);
};
export default useListenMessages;
