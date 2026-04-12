import Quiz from '../models/Quiz.js';
import Result from '../models/Result.js';

const isValidQuestion = (question) => {
  return (
    question?.questionText?.trim() &&
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    question.options.every((option) => option?.trim()) &&
    Number.isInteger(question.correctAnswer) &&
    question.correctAnswer >= 0 &&
    question.correctAnswer <= 3
  );
};

export const createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'At least one question is required.' });
    }

    const invalidQuestion = questions.some((question) => !isValidQuestion(question));
    if (invalidQuestion) {
      return res.status(400).json({ message: 'Every question must have text, 4 options, and a correct answer index from 0 to 3.' });
    }

    const quiz = await Quiz.create({
      title: title.trim(),
      description: description.trim(),
      questions,
      createdBy: req.user.id
    });

    const populatedQuiz = await quiz.populate('createdBy', 'name email role');

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz: populatedQuiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create quiz', error: error.message });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    const formatted = quizzes.map((quiz) => ({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      createdBy: quiz.createdBy,
      questionCount: quiz.questions.length,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quizzes', error: error.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name email role');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    if (req.user.role === 'admin') {
      return res.json(quiz);
    }

    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      createdBy: quiz.createdBy,
      questions: quiz.questions.map((question, index) => ({
        questionNumber: index + 1,
        questionText: question.questionText,
        options: question.options
      }))
    };

    res.json(safeQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quiz', error: error.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'At least one question is required.' });
    }

    const invalidQuestion = questions.some((question) => !isValidQuestion(question));
    if (invalidQuestion) {
      return res.status(400).json({ message: 'Every question must have text, 4 options, and a correct answer index from 0 to 3.' });
    }

    quiz.title = title.trim();
    quiz.description = description.trim();
    quiz.questions = questions;

    await quiz.save();

    const updatedQuiz = await Quiz.findById(req.params.id).populate('createdBy', 'name email role');

    res.json({
      message: 'Quiz updated successfully',
      quiz: updatedQuiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update quiz', error: error.message });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    await Result.deleteMany({ quizId: quiz._id });
    await quiz.deleteOne();

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete quiz', error: error.message });
  }
};
