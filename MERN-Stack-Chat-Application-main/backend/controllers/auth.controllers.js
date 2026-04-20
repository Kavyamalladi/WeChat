import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { ensureDemoChatsForUser } from "../utils/demoChats.js";

const getStableAvatarUrl = ({ username, gender }) => {
	// Uses real-photo placeholder avatars from pravatar.cc (1..70).
	// Stable per username so it won’t change on refresh.
	let hash = 0;
	for (let i = 0; i < username.length; i += 1) {
		hash = (hash << 5) - hash + username.charCodeAt(i);
		hash |= 0;
	}

	const base = Math.abs(hash) % 70;
	const genderOffset = gender === "female" ? 1 : 36;
	const imgId = ((base + genderOffset) % 70) + 1;

	return `https://i.pravatar.cc/150?img=${imgId}`;
};

export const signup = async (req, res) => {
	try {
		const { fullName, username, password, confirmPassword, gender } = req.body;

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		const user = await User.findOne({ username });

		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}

		// HASH PASSWORD HERE
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const profilePic = getStableAvatarUrl({ username, gender });

		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic,
		});

		if (newUser) {
			// Generate JWT token here
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();
			await ensureDemoChatsForUser(newUser._id);

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};




export const login = async(req,res)=>{
    try{
       const {username, password} = req.body;
       const user = await User.findOne({username});
       const isPasswordcorrect = await bcrypt.compare(password,user?.password || "");

       if(!user || !isPasswordcorrect){
          return res.status(400).json({error:"Invalid username or password"});
       }

       generateTokenAndSetCookie(user._id, res);
	   await ensureDemoChatsForUser(user._id);

       res.status(200).json({
          _id:user._id,
          fullName: username,
          username:user.username,
          profilePic: user.profilePic,
       });
    }
    catch(error){
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logout = (req,res)=>{
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}