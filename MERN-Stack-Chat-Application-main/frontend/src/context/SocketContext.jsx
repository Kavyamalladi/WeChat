import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() =>{
		if (authUser) {
			const socket = io("http://localhost:12345",{
                query: {
                    userId:authUser._id,
                },
            });
			

			setSocket(socket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// Simulate some demo users being online for demonstration
			// In a real app, this would come from the server
			setTimeout(() => {
				// For demo purposes, simulate some users being online
				// This will show green indicators for some conversations
				const mockOnlineUsers = [
					"mock_bob_id",
					"mock_alice_id", 
					"mock_diana_id",
					"mock_charlie_id",
					"mock_eve_id"
				];
				setOnlineUsers(mockOnlineUsers);
			}, 1000);

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
