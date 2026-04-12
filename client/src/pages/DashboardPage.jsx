import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QuizCard from '../components/QuizCard';
import quizService from '../services/quizService';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getAllQuizzes();
      setQuizzes(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm('Are you sure you want to delete this quiz?');
    if (!ok) return;

    try {
      await quizService.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete quiz');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p className="muted">Explore and attempt quizzes from your dashboard.</p>
        </div>

        
        {user?.role === 'admin' && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/quizzes/create" className="btn btn-primary">
              Create Quiz
            </Link>

            <Link to="/admin" className="btn btn-secondary">
              Admin Panel
            </Link>
          </div>
        )}
      </div>

      {loading ? (
        <div className="center-text">Loading quizzes...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : quizzes.length === 0 ? (
        <div className="card empty-state">
          <div className="card-body">
            <h3>No quizzes available</h3>
            <p className="muted">Create your first quiz to get started.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-3">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              isAdmin={user?.role === 'admin'}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;