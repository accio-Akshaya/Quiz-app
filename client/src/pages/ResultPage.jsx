import { Link, useLocation } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="container narrow">
        <div className="card">
          <div className="card-body center-text">
            <h2>No result found</h2>
            <p className="muted">Please attempt a quiz first.</p>
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container narrow">
      <div className="card result-card">
        <div className="card-body">
          <h1>Quiz Result</h1>
          <p className="muted">
            {result.quizId?.title || 'Quiz'} completed successfully.
          </p>

          <div className="result-grid">
            <div className="result-box">
              <h3>Score</h3>
              <p>
                {result.score} / {result.totalQuestions}
              </p>
            </div>

            <div className="result-box success">
              <h3>Correct</h3>
              <p>{result.correctCount}</p>
            </div>

            <div className="result-box danger">
              <h3>Wrong</h3>
              <p>{result.wrongCount}</p>
            </div>
          </div>

          <div className="card-actions">
            <Link to="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
