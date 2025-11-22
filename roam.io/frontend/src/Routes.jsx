import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Survey from "./pages/Survey";
import Plans from "./pages/Plans";
import Hotels from "./pages/Hotels";
import User from "./pages/User";

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
    </Routes>
  );
}
