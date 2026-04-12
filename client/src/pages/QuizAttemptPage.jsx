import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import quizService from '../services/quizService';
import resultService from '../services/resultService';

function QuizAttemptPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getQuizById(id);
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(null));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleSelect = (questionIndex, optionIndex) => {
    const updated = [...answers];
    updated[questionIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');

      const payload = {
        quizId: id,
        answers: answers.map((selectedAnswer, questionIndex) => ({
          questionIndex,
          selectedAnswer
        }))
      };

      const data = await resultService.submitResult(payload);

      navigate('/result', {
        state: {
          result: data.result
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="center-text">Loading quiz...</div>;
  }

  if (error && !quiz) {
    return (
      <div className="container narrow">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container narrow">
      <div className="page-header">
        <div>
          <h1>{quiz.title}</h1>
          <p className="muted">{quiz.description}</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="question-list">
        {quiz.questions.map((question, qIndex) => (
          <div className="card question-box" key={qIndex}>
            <div className="card-body">
              <h3>
                {qIndex + 1}. {question.questionText}
              </h3>

              <div className="option-list">
                {question.options.map((option, optIndex) => (
                  <label className="option-item" key={optIndex}>
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={answers[qIndex] === optIndex}
                      onChange={() => handleSelect(qIndex, optIndex)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="submit-bar">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
}

export default QuizAttemptPage;
