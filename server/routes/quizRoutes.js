import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdmin.js';
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz
} from '../controllers/quizController.js';

const router = express.Router();

router.get('/', authMiddleware, getQuizzes);
router.get('/:id', authMiddleware, getQuizById);
router.post('/', authMiddleware, isAdmin, createQuiz);
router.put('/:id', authMiddleware, isAdmin, updateQuiz);
router.delete('/:id', authMiddleware, isAdmin, deleteQuiz);

export default router;
