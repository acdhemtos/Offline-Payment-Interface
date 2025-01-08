import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./components/signin";
import LoginPage from "./components/login";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex items-center justify-center">
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;