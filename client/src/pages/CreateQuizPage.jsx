import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizForm from '../components/QuizForm';
import quizService from '../services/quizService';

function CreateQuizPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleCreateQuiz = async (payload) => {
    try {
      setError('');
      await quizService.createQuiz(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    }
  };

  return (
    <div className="container narrow">
      <div className="page-header">
        <div>
          <h1>Create Quiz</h1>
          <p className="muted">Admins can create new quizzes here.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <QuizForm onSubmit={handleCreateQuiz} submitText="Create Quiz" />
    </div>
  );
}

export default CreateQuizPage;
