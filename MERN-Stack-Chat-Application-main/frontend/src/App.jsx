import {Navigate, Route,Routes} from "react-router-dom"
import './App.css';
import Home from './pages/home/Home';
import Login from "./pages/login/Login";
import Signup from './pages/signup/Signup';
import Profile from './pages/profile/Profile';
import {Toaster} from "react-hot-toast"
import { useAuthContext } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CallContextProvider } from "./context/CallContext";
import CallModal from "./components/call/CallModal";

function App() {
  const {authUser} = useAuthContext();
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvsnKg8V-W16N6XlrEfjD4FYquJZuYvFUIuQ&s" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
      </div>
      <div className="relative z-10 mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-300/50">
        <Routes>
          <Route path="/" element={authUser ? <Home/> : <Navigate to="/login" />} />
          <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login/>} />
          <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Signup/>} />
          <Route path="/profile" element={authUser ? <Profile/> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Toaster/>
    </div>
  );
}

function AppWrapper() {
  return (
    <ThemeProvider>
      <CallContextProvider>
        <App />
      </CallContextProvider>
    </ThemeProvider>
  );
}

export default AppWrapper




