import { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";

const CallContext = createContext();

export const useCallContext = () => {
	return useContext(CallContext);
};

export const CallContextProvider = ({ children }) => {
	const [currentCall, setCurrentCall] = useState(null);
	const [callHistory, setCallHistory] = useState([]);
	const [incomingCall, setIncomingCall] = useState(null);

	const startCall = (participant, type = 'voice') => {
		const call = {
			id: Date.now(),
			participantId: participant._id,
			participantName: participant.fullName,
			participantPic: participant.profilePic,
			type: type,
			status: 'ringing',
			startTime: Date.now(),
			duration: '00:00'
		};

		setCurrentCall(call);
		
		// Simulate call connecting after 2 seconds
		setTimeout(() => {
			setCurrentCall(prev => prev ? { ...prev, status: 'connected' } : null);
			toast.success(`${type === 'video' ? 'Video' : 'Voice'} call connected`);
		}, 2000);

		// Start duration timer
		const startTime = Date.now();
		const timer = setInterval(() => {
			const elapsed = Math.floor((Date.now() - startTime) / 1000);
			const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
			const seconds = (elapsed % 60).toString().padStart(2, '0');
			
			setCurrentCall(prev => prev ? { ...prev, duration: `${minutes}:${seconds}` } : null);
		}, 1000);

		// Store timer ID for cleanup
		call.timerId = timer;
	};

	const endCall = () => {
		if (currentCall) {
			// Clear timer if exists
			if (currentCall.timerId) {
				clearInterval(currentCall.timerId);
			}

			// Add to call history
			const completedCall = {
				...currentCall,
				endTime: Date.now(),
				status: 'ended'
			};
			
			setCallHistory(prev => [completedCall, ...prev].slice(0, 10)); // Keep last 10 calls
			setCurrentCall(null);
			
			toast.success('Call ended');
		}
	};

	const receiveIncomingCall = (caller, type = 'voice') => {
		const call = {
			id: Date.now(),
			callerId: caller._id,
			callerName: caller.fullName,
			callerPic: caller.profilePic,
			type: type,
			status: 'incoming'
		};

		setIncomingCall(call);
		toast(`${type === 'video' ? 'Video' : 'Voice'} call incoming from ${caller.fullName}`, {
			icon: 'Incoming Call',
			duration: 10000
		});
	};

	const acceptIncomingCall = () => {
		if (incomingCall) {
			startCall(
				{ 
					_id: incomingCall.callerId, 
					fullName: incomingCall.callerName,
					profilePic: incomingCall.callerPic
				}, 
				incomingCall.type
			);
			setIncomingCall(null);
		}
	};

	const rejectIncomingCall = () => {
		setIncomingCall(null);
		toast('Call rejected');
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (currentCall && currentCall.timerId) {
				clearInterval(currentCall.timerId);
			}
		};
	}, [currentCall]);

	return (
		<CallContext.Provider
			value={{
				currentCall,
				callHistory,
				incomingCall,
				startCall,
				endCall,
				receiveIncomingCall,
				acceptIncomingCall,
				rejectIncomingCall
			}}
		>
			{children}
		</CallContext.Provider>
	);
};
