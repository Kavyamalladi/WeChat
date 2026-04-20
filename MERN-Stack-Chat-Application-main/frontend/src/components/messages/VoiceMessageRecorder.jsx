import { useState, useRef, useEffect } from "react";
import { FiMic, FiMicOff, FiSend, FiTrash2 } from "react-icons/fi";

const VoiceMessageRecorder = ({ onSend, onCancel }) => {
	const [isRecording, setIsRecording] = useState(false);
	const [recordingTime, setRecordingTime] = useState(0);
	const [audioURL, setAudioURL] = useState(null);
	const [audioBlob, setAudioBlob] = useState(null);
	const [isPaused, setIsPaused] = useState(false);
	
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const timerRef = useRef(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];
			
			mediaRecorder.ondataavailable = (event) => {
				audioChunksRef.current.push(event.data);
			};
			
			mediaRecorder.onstop = () => {
				const blobType = mediaRecorder.mimeType || audioChunksRef.current[0]?.type || "audio/webm";
				const recordedBlob = new Blob(audioChunksRef.current, { type: blobType });
				const url = URL.createObjectURL(recordedBlob);
				setAudioURL(url);
				setAudioBlob(recordedBlob);
				
				// Stop all tracks
				stream.getTracks().forEach(track => track.stop());
			};
			
			mediaRecorder.start();
			setIsRecording(true);
			setRecordingTime(0);
			
			// Start timer
			timerRef.current = setInterval(() => {
				setRecordingTime(prev => prev + 1);
			}, 1000);
			
		} catch (error) {
			console.error('Error accessing microphone:', error);
			alert('Unable to access microphone. Please check your permissions.');
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
			
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		}
	};

	const pauseRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			if (isPaused) {
				mediaRecorderRef.current.resume();
				timerRef.current = setInterval(() => {
					setRecordingTime(prev => prev + 1);
				}, 1000);
			} else {
				mediaRecorderRef.current.pause();
				if (timerRef.current) {
					clearInterval(timerRef.current);
				}
			}
			setIsPaused(!isPaused);
		}
	};

	const cancelRecording = () => {
		if (isRecording) {
			stopRecording();
		}
		if (audioURL) {
			URL.revokeObjectURL(audioURL);
		}
		setAudioBlob(null);
		onCancel();
	};

	const sendVoiceMessage = () => {
		if (audioBlob) {
			onSend(audioBlob, recordingTime);
			URL.revokeObjectURL(audioURL);
			setAudioBlob(null);
		}
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	return (
		<div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
			{isRecording ? (
				<>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
						<span className="text-white text-sm">{formatTime(recordingTime)}</span>
					</div>
					
					<button
						onClick={pauseRecording}
						className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
						title={isPaused ? "Resume" : "Pause"}
					>
						{isPaused ? "Resume" : "Pause"}
					</button>
					
					<button
						onClick={stopRecording}
						className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
						title="Stop"
					>
						<FiMicOff size={16} />
					</button>
				</>
			) : audioURL ? (
				<>
					<audio src={audioURL} controls className="flex-1" />
					
					<button
						onClick={sendVoiceMessage}
						className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
						title="Send"
					>
						<FiSend size={16} />
					</button>
					
					<button
						onClick={cancelRecording}
						className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
						title="Cancel"
					>
						<FiTrash2 size={16} />
					</button>
				</>
			) : (
				<>
					<button
						onClick={startRecording}
						className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors animate-pulse"
						title="Start recording"
					>
						<FiMic size={20} />
					</button>
					
					<span className="text-gray-300 text-sm">Tap to record voice message</span>
					
					<button
						onClick={onCancel}
						className="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-500 transition-colors"
						title="Cancel"
					>
						<FiTrash2 size={16} />
					</button>
				</>
			)}
		</div>
	);
};

export default VoiceMessageRecorder;
