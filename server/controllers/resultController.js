import Quiz from '../models/Quiz.js';
import Result from '../models/Result.js';

export const submitResult = async (req, res) => {
  try {
    const { quizId, answers = [] } = req.body;

    if (!quizId) {
      return res.status(400).json({ message: 'Quiz ID is required.' });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized. Please login again.' });
    }

    const answerMap = new Map();

    for (const item of answers) {
      const qIndex = Number(item.questionIndex);
      const selected =
        item.selectedAnswer === null || item.selectedAnswer === undefined
          ? null
          : Number(item.selectedAnswer);

      answerMap.set(qIndex, selected);
    }

    let score = 0;
    let correctCount = 0;

    const evaluatedAnswers = quiz.questions.map((question, index) => {
      const selectedAnswer = answerMap.has(index) ? answerMap.get(index) : null;
      const isCorrect = selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score += 1;
        correctCount += 1;
      }

      return {
        questionIndex: index,
        selectedAnswer,
        isCorrect
      };
    });

    const wrongCount = quiz.questions.length - correctCount;

    // ✅ MATCH MODEL EXACTLY
    const result = await Result.create({
      userId: req.user.id,
      quizId: quizId,
      score,
      totalQuestion: quiz.questions.length, // ⚠️ correct name
      correctCount,
      wrongCount,
      answers: evaluatedAnswers
    });

    const populatedResult = await Result.findById(result._id)
      .populate('quizId', 'title description')
      .populate('userId', 'name email role');

    res.status(201).json({
      message: 'Quiz submitted successfully',
      result: populatedResult
    });

  } catch (error) {
    console.error("🔥 RESULT ERROR:", error);
    res.status(500).json({ 
      message: 'Failed to submit result', 
      error: error.message 
    });
  }
};

export const getUserResults = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const results = await Result.find({ userId })
      .populate('quizId', 'title description')
      .sort({ createdAt: -1 });

    res.json(results);

  } catch (error) {
    console.error("🔥 GET RESULT ERROR:", error);
    res.status(500).json({ 
      message: 'Failed to fetch results', 
      error: error.message 
    });
  }
};
