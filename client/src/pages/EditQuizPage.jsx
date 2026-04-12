import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuizForm from '../components/QuizForm';
import quizService from '../services/quizService';

function EditQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getQuizById(id);
        setQuiz(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleUpdateQuiz = async (payload) => {
    try {
      setError('');
      await quizService.updateQuiz(id, payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quiz');
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
          <h1>Edit Quiz</h1>
          <p className="muted">Update quiz details and questions.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <QuizForm
        initialData={quiz}
        onSubmit={handleUpdateQuiz}
        submitText="Update Quiz"
      />
    </div>
  );
}

export default EditQuizPage;
