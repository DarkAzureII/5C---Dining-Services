import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import HomePage from "./components/HomePage";
import Dashboard from "./components/Dashboard";
import MealCreditsPage from "./components/meal credits/MealCreditsPage"; // Import the Meal Credits page
import DiningReservationsPage from "./components/Dining Reservations/DiningReservationsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <LoginForm isActive={true} onCreateAccountClick={() => {}} />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupForm isActive={true} onAlreadyHaveAccountClick={() => {}} />
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meal-credits" element={<MealCreditsPage />} /> {/* Add this route */}
        <Route path="/dining-reservations" element={<DiningReservationsPage />} /> {/* Add the route for Dining Reservations */}
      </Routes>
    </Router>
  );
};

export default App;
