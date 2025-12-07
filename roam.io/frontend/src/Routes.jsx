import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Survey from "./pages/Survey";
import Plans from "./pages/Plans";
import Hotels from "./pages/Hotels";
import User from "./pages/User";
import Flights from "./pages/Flights";
import TripPlans from "./pages/TripPlans";
import GeneratedPlans from "./pages/GeneratedPlans";
import PublicPlan from "./pages/PublicPlan";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/user" element={<User />} />
      <Route path="/flights" element={<Flights />} />
      <Route path="/trip-plans" element={<TripPlans />} />
      <Route path="/plan/:id" element={<PublicPlan />} />
      <Route path="/generated-plans" element={<GeneratedPlans />} />

    </Routes>
  );
}
