import { useState, useRef, useEffect } from "react";
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from "react-icons/fi";

const VoiceMessagePlayer = ({ audioURL, duration, sender }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [isMuted, setIsMuted] = useState(false);
	const [audioDuration, setAudioDuration] = useState(duration || 0);
	
	const audioRef = useRef(null);
	const progressBarRef = useRef(null);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleLoadedMetadata = () => {
			setAudioDuration(audio.duration || duration || 0);
		};

		const handleTimeUpdate = () => {
			setCurrentTime(audio.currentTime);
		};

		const handleEnded = () => {
			setIsPlaying(false);
			setCurrentTime(0);
		};

		audio.addEventListener('loadedmetadata', handleLoadedMetadata);
		audio.addEventListener('timeupdate', handleTimeUpdate);
		audio.addEventListener('ended', handleEnded);

		return () => {
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
			audio.removeEventListener('timeupdate', handleTimeUpdate);
			audio.removeEventListener('ended', handleEnded);
		};
	}, [audioURL, duration]);

	const togglePlayPause = () => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
		setIsPlaying(!isPlaying);
	};

	const handleProgressClick = (e) => {
		const audio = audioRef.current;
		const progressBar = progressBarRef.current;
		if (!audio || !progressBar) return;

		const rect = progressBar.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const width = rect.width;
		const percentage = clickX / width;
		
		audio.currentTime = percentage * audioDuration;
		setCurrentTime(percentage * audioDuration);
	};

	const toggleMute = () => {
		const audio = audioRef.current;
		if (!audio) return;

		audio.muted = !isMuted;
		setIsMuted(!isMuted);
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const progressPercentage = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

	return (
		<div className={`flex items-center gap-3 p-3 rounded-lg ${
			sender ? 'bg-blue-600 ml-auto max-w-xs' : 'bg-gray-700 max-w-xs'
		}`}>
			<audio
				ref={audioRef}
				src={audioURL}
				preload="metadata"
			/>
			
			{/* Voice Message Icon */}
			<div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
				sender ? 'bg-blue-700' : 'bg-gray-600'
			}`}>
				<FiVolume2 className={`text-white ${isPlaying ? 'animate-pulse' : ''}`} size={16} />
			</div>

			{/* Progress Bar and Controls */}
			<div className="flex-1">
				<div className="flex items-center gap-2">
					<button
						onClick={togglePlayPause}
						className={`p-1 rounded-full transition-colors ${
							sender 
								? 'bg-blue-700 text-white hover:bg-blue-800' 
								: 'bg-gray-600 text-white hover:bg-gray-500'
						}`}
					>
						{isPlaying ? <FiPause size={14} /> : <FiPlay size={14} />}
					</button>

					<div className="flex-1">
						<div className="relative">
							<div
								ref={progressBarRef}
								onClick={handleProgressClick}
								className={`h-2 rounded-full cursor-pointer ${
									sender ? 'bg-blue-800' : 'bg-gray-600'
								}`}
							>
								<div
									className={`h-full rounded-full transition-all ${
										sender ? 'bg-white' : 'bg-blue-400'
									}`}
									style={{ width: `${progressPercentage}%` }}
								/>
							</div>
						</div>
						<div className="flex justify-between mt-1">
							<span className={`text-xs ${sender ? 'text-blue-100' : 'text-gray-300'}`}>
								{formatTime(currentTime)}
							</span>
							<span className={`text-xs ${sender ? 'text-blue-100' : 'text-gray-300'}`}>
								{formatTime(audioDuration)}
							</span>
						</div>
					</div>

					<button
						onClick={toggleMute}
						className={`p-1 rounded-full transition-colors ${
							sender 
								? 'bg-blue-700 text-white hover:bg-blue-800' 
								: 'bg-gray-600 text-white hover:bg-gray-500'
						}`}
					>
						{isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
					</button>
				</div>
			</div>
		</div>
	);
};

export default VoiceMessagePlayer;
