import { useSocketContext } from "../../context/SocketContext";
import { useCallContext } from "../../context/CallContext";
import useConversation from "../../zustand/useConversation";
import { FiPhone, FiVideo } from "react-icons/fi";
import { useState } from "react";

const Conversation = ({ conversation, lastIdx, emoji }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { onlineUsers } = useSocketContext();
	const { startCall } = useCallContext();
	const [showCallButtons, setShowCallButtons] = useState(false);

	const isSelected = selectedConversation?._id === conversation._id;
	// For demo purposes, check if user is in online list or use username-based simulation
	const isOnline = onlineUsers.includes(conversation._id) || 
		(conversation.username && [
			"bob", "alice", "diana", "charlie", "eve", "frank", "grace"
		].includes(conversation.username.toLowerCase()));

	const handleVoiceCall = (e) => {
		e.stopPropagation();
		startCall(conversation, 'voice');
	};

	const handleVideoCall = (e) => {
		e.stopPropagation();
		startCall(conversation, 'video');
	};

	return (
		<>
			<div
				className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer group
				${isSelected ? "bg-sky-500" : ""}
			`}
				onClick={() => setSelectedConversation(conversation)}
				onMouseEnter={() => setShowCallButtons(true)}
				onMouseLeave={() => setShowCallButtons(false)}
			>
				<div className={`avatar ${isOnline ? "online" : ""}`}>
					<div className='w-12 rounded-full relative'>
						<img src={conversation.profilePic} alt='user avatar' />
						{isOnline && (
							<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
						)}
					</div>
				</div>

				<div className='flex flex-col flex-1'>
					<div className='flex gap-3 justify-between items-center'>
						<div className="flex flex-col">
							<p className='font-bold text-gray-200'>{conversation.fullName}</p>
							<p className={`text-xs ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
								{isOnline ? 'Online' : 'Offline'}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<span className='text-2xl' style={{ fontFamily: 'system-ui, "Segoe UI", "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", sans-serif' }}>{emoji}</span>
							{showCallButtons && isOnline && (
								<div className="flex gap-1">
									<button
										onClick={handleVoiceCall}
										className="p-1 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
										title="Voice call"
									>
										<FiPhone size={14} />
									</button>
									<button
										onClick={handleVideoCall}
										className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
										title="Video call"
									>
										<FiVideo size={14} />
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{!lastIdx && <div className='divider my-0 py-0 h-1' />}
		</>
	);
};
export default Conversation;

// STARTER CODE SNIPPET
// const Conversation = () => {
// 	return (
// 		<>
// 			<div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
// 				<div className='avatar online'>
// 					<div className='w-12 rounded-full'>
// 						<img
// 							src='https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
// 							alt='user avatar'
// 						/>
// 					</div>
// 				</div>

// 				<div className='flex flex-col flex-1'>
// 					<div className='flex gap-3 justify-between'>
// 						<p className='font-bold text-gray-200'>John Doe</p>
// 						<span className='text-xl'>🎃</span>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='divider my-0 py-0 h-1' />
// 		</>
// 	);
// };
// export default Conversation;






// STARTER CODE SNIPPET
// const Conversation = () => {
// 	return (
// 		<>
// 			<div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
// 				<div className='avatar online'>
// 					<div className='w-12 rounded-full'>
// 						<img
// 							src='https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
// 							alt='user avatar'
// 						/>
// 					</div>
// 				</div>

// 				<div className='flex flex-col flex-1'>
// 					<div className='flex gap-3 justify-between'>
// 						<p className='font-bold text-gray-200'>John Doe</p>
// 						<span className='text-xl'>🎃</span>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='divider my-0 py-0 h-1' />
// 		</>
// 	);
// };
// export default Conversation;