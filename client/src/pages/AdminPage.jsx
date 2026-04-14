import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/admin.css';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

 
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

 
  const makeAdmin = async (userId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/make-admin/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchUsers(); // refresh
    } catch (err) {
      console.error(err);
      alert('Failed to update role');
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, []);

 
  if (!token) return <p>Please login again</p>;
  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h1>Admin Panel</h1>
      <p className="muted">Manage users and roles</p>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              <div>
                <p><strong>{user.name}</strong></p>
                <p>{user.email}</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                
                <span className={user.role === 'admin' ? 'badge-admin' : 'badge-user'}>
                  {user.role}
                </span>

                {user.role !== 'admin' && (
                  <button
                    className="btn-admin"
                    onClick={() => makeAdmin(user._id)}
                  >
                    Make Admin
                  </button>
                )}
              </div>

            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPage;