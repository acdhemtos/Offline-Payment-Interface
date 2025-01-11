// filepath: /c:/xampp/htdocs/opi/client/account/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./components/signup";
import LoginPage from "./components/login";
import ScanQR from './components/ScanQR';
import Home from './components/Home';
import UPIPINVerification from './components/UPIPINVerification';
import OPIPINVerification from './components/OPIPINVerification';
import SendPage from './components/SendPage';
import ReceivePage from './components/ReceivePage';
import StatusPage from './components/StatusPage';
import CommunicatePage from './components/CommunicatePage';
import { getRelativePath } from "./utils/utils";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex items-center justify-center">
        <Routes>
          <Route path={getRelativePath("/")} element={<LoginPage />} />
          <Route path={getRelativePath("/signup")} element={<SignupPage />} />
          <Route path={getRelativePath("/login")} element={<LoginPage />} />
          <Route path={getRelativePath("/send")} element={<SendPage />} />
          <Route path={getRelativePath("/recieve")} element={<ReceivePage />} />
          <Route path={getRelativePath("/scan")} element={<ScanQR />} />
          <Route path={getRelativePath("/upi-pin")} element={<UPIPINVerification />} />
          <Route path={getRelativePath("/opi-pin")} element={<OPIPINVerification />} />
          <Route path={getRelativePath("/status")} element={<StatusPage />} />
          <Route path={getRelativePath("/communicate")} element={<CommunicatePage />} />
          <Route path={getRelativePath("/home")} element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;