import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm isActive={true} onCreateAccountClick={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
        <Route path="/signup" element={<SignupForm isActive={true} onAlreadyHaveAccountClick={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
