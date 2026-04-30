import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    
      <Routes>
        {/* ✅ Login is default page */}
        <Route path="/" element={<LoginPage />} />

        {/* ✅ Home page after login */}
        <Route path="/home" element={<HomePage />} />
      </Routes>
  
  );
}

export default App;