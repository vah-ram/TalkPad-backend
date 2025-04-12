import express from 'express';
import { register, login, getAllUsers, addContacts, getContacts, deleteContacts } from '../controllers/signController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsers);
router.post('/addContacts', addContacts);
router.post('/getContacts', getContacts);
router.post('/deleteContacts', deleteContacts);

export default router;