import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './AuthForms.css';

type LoginFormProps = {
  isActive: boolean;
  onCreateAccountClick: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ isActive, onCreateAccountClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect to the Dashboard component
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className={`container login-container ${isActive ? 'active' : ''}`} id="login-container">
      <h2>Login</h2>
      <form id="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p id="login-error" style={{ color: 'red' }}>{error}</p>}
      </form>
      <div className="create-account">
        <p>
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccountClick(); }} id="show-signup">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
