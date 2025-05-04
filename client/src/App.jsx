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
import Settings from "./components/Settings";
import SetPin from "./components/setPin";
import SuccessPage from "./components/Success";
import QRMirror from './components/box.jsx';
import FastSend from "./components/fast-send.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex items-center justify-center">
        <Routes>
          <Route path={"/"} element={<LoginPage />} />
          <Route path={"/account/signup"} element={<SignupPage />} />
          <Route path={"/account/login"} element={<LoginPage />} />
          <Route path={"/app/send"} element={<SendPage />} />
          <Route path={"/app/recieve"} element={<ReceivePage />} />
          <Route path={"/app/scan"} element={<ScanQR />} />
          <Route path={"/app/upi-pin"} element={<UPIPINVerification />} />
          <Route path={"/app/opi-pin"} element={<OPIPINVerification />} />
          <Route path={"/app/status"} element={<StatusPage />} />
          <Route path={"/app/set-pin"} element={<SetPin />} />
          <Route path={"/app/communicate"} element={<CommunicatePage />} />
          <Route path={"/app/transactions"} element={<TransactionHistory />} />
          <Route path={"/app/settings"} element={<Settings/>}/>
          <Route path={"/app/home"} element={<Home />} />
          <Route path={"/app/success"} element={<SuccessPage />} />
          <Route path={"/screenbox"} element={<QRMirror />} />
          <Route path={"/fast-send"} element={<FastSend/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;