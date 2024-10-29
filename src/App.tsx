import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage"; // Ensure this has a default export
import Dashboard from "./components/Dashboard"; // Ensure this has a default export
import MealCreditsPage from "./components/meal credits/MealCreditsPage"; // Ensure this has a default export
import DiningReservationsPage from "./components/Dining Reservations/DiningReservationsPage"; // Ensure this has a default export
import DietaryManagementPage from "./components/Dietary Management/DietaryManagementPage"; // Ensure this has a default export
import ReservationHistory from './components/Feedback System/ReservationHistory'; // Ensure this has a default export
import AuthPage from "./components/AuthPage"; // Ensure this has a default export

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meal-credits" element={<MealCreditsPage />} />
        <Route path="/dining-reservations" element={<DiningReservationsPage />} />
        <Route path="/dietary-management" element={<DietaryManagementPage />} />
        <Route path="/reservation-history" element={<ReservationHistory />} />
      </Routes>
    </Router>
  );
};

export default App;
