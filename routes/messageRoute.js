import express from 'express';
import { addMessage, getMessage, deleteMessage } from '../controllers/messageController.js';

const router = express.Router();

router.post('/addmessage', addMessage);
router.get('/getmessage', getMessage);
router.delete('/deleteMessage', deleteMessage)

export default router;