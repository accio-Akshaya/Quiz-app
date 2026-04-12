import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ✅ Normal login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData);

      // store token (important)
      localStorage.setItem('token', data.token);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("GOOGLE RESPONSE:", credentialResponse); // 🔥 DEBUG

    console.log("TOKEN:", credentialResponse.credential);
    try {
      setError('');

      // ✅ IMPORTANT: send ONLY credential
      const data = await googleLogin(credentialResponse.credential);

      // store token
      localStorage.setItem('token', data.token);

      navigate('/dashboard');
    } catch (err) {
      console.error("GOOGLE LOGIN ERROR:", err); // 🔥 DEBUG
      setError(err.response?.data?.message || 'Google login failed');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed');
  };

  return (
    <div className="auth-wrapper">
      <form className="card form auth-card" onSubmit={handleSubmit}>
        <div className="card-body">
          <h2>Login</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="divider">OR</div>

          <div className="google-login-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          <p className="helper-text">
            Don&apos;t have an account? <Link to="/signup">Signup</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
