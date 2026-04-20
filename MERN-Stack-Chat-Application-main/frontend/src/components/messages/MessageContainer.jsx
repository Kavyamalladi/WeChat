import { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import { useCallContext } from "../../context/CallContext";
import { FiPhone, FiVideo } from "react-icons/fi";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { socket } = useSocketContext();
	const { startCall } = useCallContext();
	const { onlineUsers } = useSocketContext();
	const [isTyping, setIsTyping] = useState(false);

	const isOnline = onlineUsers.includes(selectedConversation?._id) || 
		(selectedConversation?.username && [
			"bob", "alice", "diana", "charlie", "eve", "frank", "grace"
		].includes(selectedConversation.username.toLowerCase()));

	const handleVoiceCall = () => {
		if (selectedConversation) {
			startCall(selectedConversation, 'voice');
		}
	};

	const handleVideoCall = () => {
		if (selectedConversation) {
			startCall(selectedConversation, 'video');
		}
	};

	useEffect(() => {
		// cleanup function for restore selected user 
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	useEffect(() => {
		if (socket) {
			socket.on("typing", ({ senderId }) => {
				if (senderId === selectedConversation?._id) {
					setIsTyping(true);
				}
			});

			socket.on("stopTyping", ({ senderId }) => {
				if (senderId === selectedConversation?._id) {
					setIsTyping(false);
				}
			});

			return () => {
				socket.off("typing");
				socket.off("stopTyping");
			};
		}
	}, [socket, selectedConversation]);

	return (
		<div className='md:min-w-[450px] flex flex-col'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='bg-slate-500 px-4 py-3 mb-2'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								<div className='relative'>
									<div className='w-10 h-10 rounded-full overflow-hidden'>
										<img 
											src={selectedConversation.profilePic} 
											alt={selectedConversation.fullName}
											className='w-full h-full object-cover'
										/>
									</div>
									{isOnline && (
										<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
									)}
								</div>
								<div>
									<div className='flex items-center gap-2'>
										<span className='text-gray-900 font-bold'>{selectedConversation.fullName}</span>
										<span className={`text-xs px-2 py-1 rounded-full ${
											isOnline ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-700'
										}`}>
											{isOnline ? 'Online' : 'Offline'}
										</span>
									</div>
								</div>
							</div>
							<div className='flex gap-2'>
								{isOnline && (
									<>
										<button
											onClick={handleVoiceCall}
											className='p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors'
											title='Voice call'
										>
											<FiPhone size={16} />
										</button>
										<button
											onClick={handleVideoCall}
											className='p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors'
											title='Video call'
										>
											<FiVideo size={16} />
										</button>
									</>
								)}
							</div>
						</div>
					</div>
					<Messages />
					{isTyping && <div className='px-4 text-sm text-gray-400'>Typing...</div>}
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser.fullName} ❄</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};




// STARTER CODE SNIPPET
// import Messages from "./Messages";
// import MessageInput from "./MessageInput";

// const MessageContainer = () => {
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
// 			<>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
// 		</div>
// 	);
// };
// export default MessageContainer;