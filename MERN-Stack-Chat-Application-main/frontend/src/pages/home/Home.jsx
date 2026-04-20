import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messages/MessageContainer";
import CallModal from "../../components/call/CallModal";
import { useCallContext } from "../../context/CallContext";
const Home = () => {
	const { currentCall, endCall } = useCallContext();

	return (
		<>
			<div className='flex sm:h-[450px] md:h-[550px] rounded-lg overflow-visible bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<Sidebar />
				<MessageContainer />
			</div>
			<CallModal call={currentCall} onEndCall={endCall} />
		</>
	);
};
export default Home;