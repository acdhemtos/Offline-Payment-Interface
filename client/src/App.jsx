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
import TransactionHistory from './components/TransactionHistory';
import { getRelativePath } from "./utils/utils";
import Settings from "./components/Settings";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex items-center justify-center">
        <Routes>
          <Route path={getRelativePath("/")} element={<LoginPage />} />
          <Route path={getRelativePath("/account/signup")} element={<SignupPage />} />
          <Route path={getRelativePath("/account/login")} element={<LoginPage />} />
          <Route path={getRelativePath("/app/send")} element={<SendPage />} />
          <Route path={getRelativePath("/app/recieve")} element={<ReceivePage />} />
          <Route path={getRelativePath("/app/scan")} element={<ScanQR />} />
          <Route path={getRelativePath("/app/upi-pin")} element={<UPIPINVerification />} />
          <Route path={getRelativePath("/app/opi-pin")} element={<OPIPINVerification />} />
          <Route path={getRelativePath("/app/status")} element={<StatusPage />} />
          <Route path={getRelativePath("/app/communicate")} element={<CommunicatePage />} />
          <Route path={getRelativePath("/app/transactions")} element={<TransactionHistory />} />
          <Route path={getRelativePath("/app/settings")} element={<Settings/>}/>
          <Route path={getRelativePath("/app/home")} element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;