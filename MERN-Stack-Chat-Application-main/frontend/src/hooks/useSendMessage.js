import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message, files = [], voiceMessageBlob = null, voiceDuration = 0) => {
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("message", message);
			files.forEach(file => {
				formData.append("files", file);
			});
			
			if (voiceMessageBlob) {
				const mimeType = voiceMessageBlob.type || "audio/webm";
				const extension = mimeType.includes("ogg")
					? "ogg"
					: mimeType.includes("mp4")
						? "mp4"
						: mimeType.includes("wav")
							? "wav"
							: "webm";
				const audioFile = new File([voiceMessageBlob], `voice-message.${extension}`, {
					type: mimeType,
				});
				formData.append("voiceMessage", audioFile);
				formData.append("voiceDuration", voiceDuration.toString());
			}

			const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages([...messages, data]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
