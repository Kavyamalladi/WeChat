import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
	const { authUser, setAuthUser } = useAuthContext();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		fullName: authUser?.fullName || "",
		username: authUser?.username || "",
		gender: authUser?.gender || "",
		profilePic: authUser?.profilePic || "",
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/user/update", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
			setAuthUser(data);
			toast.success("Profile updated successfully");
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">Full Name</label>
						<input
							type="text"
							name="fullName"
							value={formData.fullName}
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Username</label>
						<input
							type="text"
							name="username"
							value={formData.username}
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Gender</label>
						<select
							name="gender"
							value={formData.gender}
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							required
						>
							<option value="">Select Gender</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
						<input
							type="url"
							name="profilePic"
							value={formData.profilePic}
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						Update Profile
					</button>
				</form>
				<button
					onClick={() => navigate("/")}
					className="w-full mt-4 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
				>
					Back to Chat
				</button>
			</div>
		</div>
	);
};

export default Profile;