import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Survey from "./pages/Survey";
import Plans from "./pages/Plans";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/plans" element={<Plans />} />
    </Routes>
  );
}
