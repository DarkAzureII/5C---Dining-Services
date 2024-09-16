import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import MealCreditsPage from './components/meal credits/MealCreditsPage'; // Import the new page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm isActive={true} onCreateAccountClick={() => {}} />} />
        <Route path="/signup" element={<SignupForm isActive={true} onAlreadyHaveAccountClick={() => {}} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meal-credits" element={<MealCreditsPage />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
};

export default App;


