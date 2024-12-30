import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './style1.module.css'; // Importing CSS module

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Form Data being sent:", formData); // Log form data

    try {
      const response = await axios.post('https://bookrecommendation-fullstack-2.onrender.com/login', formData);
      console.log('Full response data:', response.data);

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('username', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.userId); // Store userId in localStorage
      }

      navigate('/main');
    } catch (error) {
      console.error("Login error:", error); // Log error for debugging
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    navigate('/'); // Navigate to Signup page
  };

  return (
    <div className={styles.container}> {/* Using CSS module class */}
      <h2>Login</h2>
      {loading ? ( // Show loading text or spinner if loading is true
        <div className={styles.loading}>
          <p>Loading...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className={styles.formLabel}>Email </label>
            <input
              type="email"
              className={`form-control ${styles.formControl}`} // Combining with Bootstrap class
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div><br />

          <div className="mb-3">
            <label htmlFor="password" className={styles.formLabel}>Password </label>
            <input
              type="password"
              className={`form-control ${styles.formControl}`} // Combining with Bootstrap class
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div><br />

          {error && <div className={styles.alert}>{error}</div>} {/* Using CSS module class */}

          <div className={styles.dFlex}>
            <button type="submit" className={styles.btnPrimary}>Login</button><br />
            <p>Don't have an account? </p>
            <button
              type="button"
              className={styles.btnLink}
              onClick={handleSignupRedirect}
            >
              Signup
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;
