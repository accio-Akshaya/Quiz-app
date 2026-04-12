import express from 'express';
import { register, login, googleLogin } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdmin.js';
import { makeAdmin } from '../controllers/authController.js';
import { getUsers } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/users', authMiddleware, getUsers);
router.put('/make-admin/:userId', authMiddleware, makeAdmin);

export default router;
