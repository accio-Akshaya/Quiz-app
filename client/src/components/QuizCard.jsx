import { Link } from 'react-router-dom';

function QuizCard({ quiz, isAdmin, onDelete }) {
  return (
    <div className="card quiz-card">
      <div className="card-body">
        <h3>{quiz.title}</h3>
        <p className="muted">{quiz.description}</p>

        <div className="quiz-meta">
          <span>{quiz.questionCount} Questions</span>
          <span>
            By {quiz.createdBy?.name || 'Admin'}
          </span>
        </div>

        <div className="card-actions">
          <Link to={`/quizzes/attempt/${quiz._id}`} className="btn btn-primary">
            Start Quiz
          </Link>

          {isAdmin && (
            <>
              <Link to={`/quizzes/edit/${quiz._id}`} className="btn btn-secondary">
                Edit
              </Link>
              <button
                className="btn btn-danger"
                onClick={() => onDelete(quiz._id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizCard;
