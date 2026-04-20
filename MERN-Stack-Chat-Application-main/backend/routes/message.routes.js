import express from "express";
import { sendMessage ,getMessages, markAsRead, addReaction, deleteMessage} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const upload = multer({ storage });

router.get("/:id",protectRoute,getMessages);
router.post("/send/:id",protectRoute,upload.fields([{ name: 'files', maxCount: 5 }, { name: 'voiceMessage', maxCount: 1 }]),sendMessage);
router.put("/read/:id",protectRoute,markAsRead);
router.put("/react/:messageId",protectRoute,addReaction);
router.delete("/:messageId",protectRoute,deleteMessage);

export default router