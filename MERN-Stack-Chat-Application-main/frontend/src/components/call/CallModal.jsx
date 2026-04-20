import { useState } from "react";
import { FiPhone, FiVideo, FiMic, FiMicOff, FiVideoOff, FiMaximize, FiMinimize } from "react-icons/fi";

const CallModal = ({ call, onEndCall }) => {
	const [isMuted, setIsMuted] = useState(false);
	const [isVideoOff, setIsVideoOff] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const handleToggleMute = () => {
		setIsMuted(!isMuted);
	};

	const handleToggleVideo = () => {
		setIsVideoOff(!isVideoOff);
	};

	const handleToggleFullscreen = () => {
		setIsFullscreen(!isFullscreen);
	};

	if (!call) return null;

	return (
		<div className={`fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col ${isFullscreen ? '' : 'items-center justify-center'}`}>
			<div className={`${isFullscreen ? 'flex-1' : 'w-full max-w-4xl'}`}>
				{/* Call Header */}
				<div className="bg-gray-900 text-white p-4 flex justify-between items-center">
					<div>
						<h2 className="text-xl font-semibold">
							{call.type === 'video' ? 'Video Call' : 'Voice Call'}
						</h2>
						<p className="text-sm text-gray-300">with {call.participantName}</p>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-300">
							{call.duration || '00:00'}
						</span>
					</div>
				</div>

				{/* Call Content */}
				<div className={`${isFullscreen ? 'flex-1 flex' : 'bg-gray-800'}`}>
					{call.type === 'video' ? (
						<div className={`flex-1 relative ${isFullscreen ? 'flex' : 'h-96'}`}>
							{/* Main Video */}
							<div className="flex-1 bg-gray-900 flex items-center justify-center">
								{isVideoOff ? (
									<div className="text-center">
										<div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
											<FiVideoOff size={48} className="text-gray-500" />
										</div>
										<p className="text-white text-lg">{call.participantName}</p>
										<p className="text-gray-400">Camera is off</p>
									</div>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<div className="text-center">
											<div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
												<img 
													src={call.participantPic || "https://i.pravatar.cc/150?img=1"} 
													alt={call.participantName}
													className="w-full h-full rounded-full object-cover"
												/>
											</div>
											<p className="text-white text-lg">{call.participantName}</p>
										</div>
									</div>
								)}
							</div>

							{/* Self Video */}
							<div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
								{isVideoOff ? (
									<FiVideoOff size={24} className="text-gray-500" />
								) : (
									<div className="text-center">
										<div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
											<span className="text-white text-xs">You</span>
										</div>
									</div>
								)}
							</div>
						</div>
					) : (
						// Voice Call Interface
						<div className="flex items-center justify-center h-64">
							<div className="text-center">
								<div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
									<img 
										src={call.participantPic || "https://i.pravatar.cc/150?img=1"} 
										alt={call.participantName}
										className="w-full h-full rounded-full object-cover"
									/>
								</div>
								<p className="text-white text-xl font-semibold">{call.participantName}</p>
								<p className="text-gray-400">{isMuted ? 'You are muted' : 'On call'}</p>
								<div className="mt-4">
									<div className="inline-flex items-center gap-2">
										<div className={`w-3 h-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
										<span className="text-sm text-gray-300">
											{isMuted ? 'Muted' : 'Connected'}
										</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Call Controls */}
				<div className="bg-gray-900 p-4 flex justify-center items-center gap-4">
					<button
						onClick={handleToggleMute}
						className={`p-4 rounded-full transition-colors ${
							isMuted 
								? 'bg-red-500 hover:bg-red-600 text-white' 
								: 'bg-gray-700 hover:bg-gray-600 text-white'
						}`}
					>
						{isMuted ? <FiMicOff size={24} /> : <FiMic size={24} />}
					</button>

					{call.type === 'video' && (
						<button
							onClick={handleToggleVideo}
							className={`p-4 rounded-full transition-colors ${
								isVideoOff 
									? 'bg-red-500 hover:bg-red-600 text-white' 
									: 'bg-gray-700 hover:bg-gray-600 text-white'
							}`}
						>
							{isVideoOff ? <FiVideoOff size={24} /> : <FiVideo size={24} />}
						</button>
					)}

					{call.type === 'video' && (
						<button
							onClick={handleToggleFullscreen}
							className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
						>
							{isFullscreen ? <FiMinimize size={24} /> : <FiMaximize size={24} />}
						</button>
					)}

					<button
						onClick={onEndCall}
						className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
					>
						<FiPhone size={24} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default CallModal;
