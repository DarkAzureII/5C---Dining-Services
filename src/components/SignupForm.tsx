import React, { useState } from 'react';
import { auth } from '../firebaseConfig'; // Import auth from your config file
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Correct import

type SignupFormProps = {
  isActive: boolean;
  onAlreadyHaveAccountClick: () => void; 
};

const SignupForm: React.FC<SignupFormProps> = ({ isActive, onAlreadyHaveAccountClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Handle successful sign up
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={`container signup-container ${isActive ? 'active' : ''}`} id="signup-container">
      <h2>Sign Up</h2>
      <form id="signup-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          id="signup-confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <p id="signup-error" style={{ color: 'red' }}>{error}</p>
      </form>
      <div className="already-account">
        <p>
          Already have an account? 
          <a href="#" onClick={(e) => { e.preventDefault(); onAlreadyHaveAccountClick(); }} id="show-login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
