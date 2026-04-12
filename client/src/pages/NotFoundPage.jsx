import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="container narrow">
      <div className="card">
        <div className="card-body center-text">
          <h1>404</h1>
          <p className="muted">Page not found.</p>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;

// h7JIvUd4dacoY9P6