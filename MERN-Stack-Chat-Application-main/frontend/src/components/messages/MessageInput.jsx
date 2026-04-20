import { useState, useEffect, useRef } from "react";
import { BsSend, BsMic } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import { FiPaperclip } from "react-icons/fi";
import useSendMessage from "../../hooks/useSendMessage";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import VoiceMessageRecorder from "./VoiceMessageRecorder";
import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [files, setFiles] = useState([]);
	const [isRecordingVoice, setIsRecordingVoice] = useState(false);
	const { loading, sendMessage } = useSendMessage();
	const { socket } = useSocketContext();
	const { selectedConversation } = useConversation();
	const emojiContainerRef = useRef(null);
	const fileInputRef = useRef(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message && files.length === 0) return;
		await sendMessage(message, files);
		setMessage("");
		setFiles([]);
		socket?.emit("stopTyping", { senderId: selectedConversation._id, receiverId: selectedConversation._id });
	};

	const handleInputChange = (e) => {
		setMessage(e.target.value);
		if (e.target.value) {
			socket?.emit("typing", { senderId: selectedConversation._id, receiverId: selectedConversation._id });
		} else {
			socket?.emit("stopTyping", { senderId: selectedConversation._id, receiverId: selectedConversation._id });
		}
	};

	const addEmoji = (emoji) => {
		setMessage(prev => prev + emoji.native);
		setShowEmojiPicker(false);
	};

	const handleFileSelect = (e) => {
		const selectedFiles = Array.from(e.target.files);
		setFiles(prev => [...prev, ...selectedFiles]);
	};

	const removeFile = (index) => {
		setFiles(prev => prev.filter((_, i) => i !== index));
	};

	const handleVoiceMessageSend = async (audioBlob, duration) => {
		await sendMessage("", [], audioBlob, duration);
		setIsRecordingVoice(false);
	};

	const handleVoiceMessageCancel = () => {
		setIsRecordingVoice(false);
	};

	const toggleVoiceRecording = () => {
		setIsRecordingVoice(!isRecordingVoice);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (emojiContainerRef.current && !emojiContainerRef.current.contains(event.target)) {
				setShowEmojiPicker(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		return () => {
			socket?.emit("stopTyping", { senderId: selectedConversation._id, receiverId: selectedConversation._id });
		};
	}, [socket, selectedConversation]);

	return (
		<div className='relative'>
			{files.length > 0 && (
				<div className='px-4 py-2 bg-gray-800 rounded-t-lg'>
					{files.map((file, index) => (
						<div key={index} className='flex items-center gap-2 mb-1'>
							<span className='text-sm text-white'>{file.name}</span>
							<button onClick={() => removeFile(index)} className='text-red-500'>×</button>
						</div>
					))}
				</div>
			)}
			{isRecordingVoice ? (
				<VoiceMessageRecorder 
					onSend={handleVoiceMessageSend} 
					onCancel={handleVoiceMessageCancel}
				/>
			) : (
				<form className='px-4 my-3' onSubmit={handleSubmit}>
					<div className='w-full relative'>
						<input
							type='text'
							className='border text-sm rounded-lg block w-full p-2.5 pr-20 bg-gray-700 border-gray-600 text-white'
							placeholder='Send a message'
							value={message}
							onChange={handleInputChange}
						/>
						<input
							type='file'
							ref={fileInputRef}
							onChange={handleFileSelect}
							multiple
							className='hidden'
						/>
						<div className='absolute inset-y-0 right-0 flex items-center gap-1 pr-2'>
							<button
								type='button'
								className='p-2 text-gray-400 hover:text-white transition-colors'
								onClick={() => fileInputRef.current.click()}
								title='Attach file'
							>
								<FiPaperclip size={18} />
							</button>
							<div ref={emojiContainerRef} className='relative'>
								<button
									type='button'
									className='p-2 text-gray-400 hover:text-white transition-colors'
									onClick={() => setShowEmojiPicker((prev) => !prev)}
									title='Add emoji'
								>
									<MdEmojiEmotions size={18} />
								</button>
								{showEmojiPicker && (
									<div className='absolute bottom-12 right-0 z-50'>
										<Picker data={data} onEmojiSelect={addEmoji} theme="dark" previewPosition="none" />
									</div>
								)}
							</div>
							<button
								type='button'
								className='p-2 text-gray-400 hover:text-red-400 transition-colors'
								onClick={toggleVoiceRecording}
								title='Record voice message'
							>
								<BsMic size={18} />
							</button>
							<button 
								type='submit' 
								className='p-2 text-blue-400 hover:text-blue-300 transition-colors'
								title='Send message'
							>
								{loading ? <div className='loading loading-spinner scale-75'></div> : <BsSend size={18} />}
							</button>
						</div>
					</div>
				</form>
			)}
		</div>
	);
};
export default MessageInput;



// STARTER CODE SNIPPET
// import { BsSend } from "react-icons/bs";

// const MessageInput = () => {
// 	return (
// 		<form className='px-4 my-3'>
// 			<div className='w-full'>
// 				<input
// 					type='text'
// 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// 					placeholder='Send a message'
// 				/>
// 				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
// 					<BsSend />
// 				</button>
// 			</div>
// 		</form>
// 	);
// };
// export default MessageInput;