import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.tsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;