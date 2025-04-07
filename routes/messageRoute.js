import express from 'express';
import { addMessage, getMessage } from '../controllers/messageController.js';

const router = express.Router();

router.post('/addmessage', addMessage);
router.post('/getmessage', getMessage);

export default router;