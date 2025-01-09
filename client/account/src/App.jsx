import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./components/signup";
import LoginPage from "./components/login";
import { getRelativePath } from "./utils/utils";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex items-center justify-center">
        <Routes>
          <Route path={getRelativePath("/")} element={<LoginPage />} />
          <Route path={getRelativePath("/signup")} element={<SignupPage />} />
          <Route path={getRelativePath("/login")} element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;