import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ReportPage from "./pages/ReportPage";

function App() {
  return (
    
      <Routes>
        {/* ✅ Login is default page */}
        <Route path="/" element={<LoginPage />} />

        {/* ✅ Home page after login */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/reports/:id" element={<ReportPage />} />  
      </Routes>
  
  );
}

export default App;