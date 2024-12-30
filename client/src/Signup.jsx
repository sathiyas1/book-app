import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './style1.module.css'; // Importing CSS module

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const [success, setSuccess] = useState(''); // New success message state
  const [passwordValid, setPasswordValid] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  });
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      setPasswordValid({
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        hasNumber: /\d/.test(value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordValid.hasUppercase && passwordValid.hasLowercase && passwordValid.hasNumber) {
      setLoading(true); // Start loading
      setError(''); // Clear any previous errors
      setSuccess(''); // Clear any previous success message
      try {
        // Using localhost for the backend URL
        const response = await axios.post('https://bookrecommendation-fullstack-2.onrender.com/signup', formData);
        console.log('Signup successful:', response.data);
        setLoading(false); // Stop loading
        setSuccess('Signed up successfully! Redirecting to login...'); // Set success message
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      } catch (error) {
        setLoading(false); // Stop loading
        setError(error.response.data.message);
      }
    } else {
      setError('Please meet all password requirements.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const hidePasswordRules = () => {
    setShowPasswordRules(false);
  };

  return (
    <div className={styles.container}>
      <h2>Signup Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className={styles.formLabel}>Name</label>
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onFocus={hidePasswordRules}
            required
          />
        </div><br /><br />

        <div className="mb-3">
          <label htmlFor="email" className={styles.formLabel}>Email</label>
          <input
            type="email"
            className={`form-control ${styles.formControl}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={hidePasswordRules}
            required
          />
        </div><br /><br />

        <div className="mb-3">
          <label htmlFor="password" className={styles.formLabel}>Password</label>
          <input
            type="password"
            className={`form-control ${styles.formControl}`}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onFocus={() => setShowPasswordRules(true)}
            required
          />
        </div><br /><br />

        {showPasswordRules && (
          <div className={styles.passwordRules}>
            <p>Password must contain:</p>
            <ul>
              <li style={{ color: passwordValid.hasUppercase ? 'green' : 'red' }}>
                {passwordValid.hasUppercase ? '✔' : '✘'} One uppercase letter
              </li>
              <li style={{ color: passwordValid.hasLowercase ? 'green' : 'red' }}>
                {passwordValid.hasLowercase ? '✔' : '✘'} One lowercase letter
              </li>
              <li style={{ color: passwordValid.hasNumber ? 'green' : 'red' }}>
                {passwordValid.hasNumber ? '✔' : '✘'} One number
              </li>
            </ul>
          </div>
        )}

        {loading && <div className={styles.loading}>Signing up...</div>} {/* Show loading message */}
        {success && <div className={styles.success}>{success}</div>} {/* Show success message */}
        {error && <div className={styles.alert}>{error}</div>}

        <div className={styles.dFlex}>
          <button type="submit" className={styles.btnPrimary} disabled={
            !(passwordValid.hasUppercase && passwordValid.hasLowercase && passwordValid.hasNumber) || loading
          }>
            Register
          </button><br /><br />
          <p>Already have an account?</p>
          <button
            type="button"
            className={styles.btnLink}
            onClick={handleLoginRedirect}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
