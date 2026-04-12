import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { submitResult, getUserResults } from '../controllers/resultController.js';

const router = express.Router();

router.post('/', authMiddleware, submitResult);
router.get('/:userId', authMiddleware, getUserResults);

export default router;
