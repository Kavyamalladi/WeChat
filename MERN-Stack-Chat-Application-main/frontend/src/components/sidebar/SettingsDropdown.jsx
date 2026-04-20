import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaCog } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { useTheme } from "../../context/ThemeContext";
import useLogout from "../../hooks/useLogout";
import LogoutButton from "./LogoutButton";

const SettingsDropdown = () => {
	const { theme, toggleTheme } = useTheme();
	const [isOpen, setIsOpen] = useState(false);
	const { loading: isLoggingOut, logout } = useLogout();

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="relative">
			<button
				onClick={toggleDropdown}
				className="btn btn-outline btn-primary w-full justify-between"
			>
				<span className="flex items-center gap-2">
					<FaCog /> Settings
				</span>
				<svg
					className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{isOpen && (
				<div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
					<div className="py-1">
						<button
							onClick={() => {
								toggleTheme();
								setIsOpen(false);
							}}
							className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700"
						>
							{theme === 'dark' ? <MdLightMode className="text-lg" /> : <MdDarkMode className="text-lg" />}
							<span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
						</button>
						
						<Link
							to="/profile"
							onClick={() => setIsOpen(false)}
							className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700"
						>
							<FaUser className="text-lg" />
							<span>Profile</span>
						</Link>

						<button
							disabled={isLoggingOut}
							onClick={async () => {
								await logout();
								setIsOpen(false);
								window.location.href = "/login";
							}}
							className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
						>
							<BiLogOut className="text-lg" />
							<span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
						</button>
						
						<div className="border-t border-gray-200 my-1"></div>
						
						<div className="px-4 py-2">
							<LogoutButton />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SettingsDropdown;
