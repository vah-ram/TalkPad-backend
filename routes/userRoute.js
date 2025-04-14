import express from 'express';
import { register, login, getAllUsers, addContacts, getContacts, deleteContacts, getAvatarUrl } from '../controllers/signController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsers);
router.post('/addContacts', addContacts);
router.get('/getContacts/:myId', getContacts);
router.delete('/deleteContacts', deleteContacts);
router.get('/getAvatar', getAvatarUrl);

export default router;