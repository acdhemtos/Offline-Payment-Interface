import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { FaRupeeSign, FaArrowLeft } from "react-icons/fa";
import Cookies from "js-cookie";
import { QR } from "../utils/qrFunctions";
import { AJAX } from "../utils/ajax";
import jsQR from "jsqr";
import { ClipLoader } from "react-spinners";
import { messages } from "../utils/loadMessages";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addTransaction,
} from "../utils/transactions";

const ReceivePage = () => {
  const [uamount, setUamount] = useState("");
  const [qrData, setQrData] = useState("");
  const [username, setUsername] = useState("");
  const [isAmountDisabled, setIsAmountDisabled] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(
    "bg-gradient-to-b from-blue-50 to-blue-100"
  );
  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [transactionStatus, setTransactionStatus] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [hideQRCode, setHideQRCode] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");

  const generateReceiveQR = (amount = "", name = false) => {
    const username = Cookies.get("username");
    if (amount != "") {
      let amt = amount * 100;
      if (name !== false) {
        return QR.encode("username+amount+name",username,amt,name);
      }
      return QR.encode("username+amount",username,amount);
    }
    
    return QR.encode("username",username);
  };

  useEffect(() => {
    const fetchUsername = async () => {
      setQrData(generateReceiveQR());
    };

    fetchUsername();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const [integerPart, decimalPart] = value.split(".");
    if (decimalPart && decimalPart.length > 2) {
      return;
    }
    setUamount(value);
    setQrData(generateReceiveQR(value));
  };

  const generateQRCode = async () => {
    const name = decodeURIComponent(localStorage.getItem("name"));

    const amount = uamount;
    setQrData(generateReceiveQR(amount, name));
    setIsAmountDisabled(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      const scan = async () => {
        if (video.readyState !== 4) {
          requestAnimationFrame(scan);
          return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

        if (qrCode) {
          const rawValue = qrCode.data;
          console.log(rawValue);

          if (rawValue.length != 44) {
            requestAnimationFrame(scan);
            return;
          }
          
          console.log("here");
          let dat = QR.decode("sender+time+details_hash", rawValue);
          console.log("Decoded data:", dat);
          
          console.log(dat);

          if (dat===false) {
            requestAnimationFrame(scan);
            return;
          }
          let { sender, time, details_hash } = dat;
          //let details_hash = hash;
          console.log(details_hash, sender);
          //close webcam
          const stopStream = () => {
            if (video.srcObject) {
              const stream = video.srcObject;
              const tracks = stream.getTracks();
              tracks.forEach((track) => track.stop());
              video.srcObject = null;
            }
          };
          stopStream();

          setHideQRCode(true);
          setShowOverlay(true);

          const sessionKey = Cookies.get("session_key");
          const username = Cookies.get("username");
          const amount = uamount * 100;

          let data, code;
          try {
            console.log("details", details_hash);
            data = await AJAX("/api/receive.php", {
              username,
              session_key: sessionKey,
              amount,
              sender,
              time,
              details_hash,
            });

            if (data) {
              code = data.code;
            } else {
              throw Error("Server Error");
            }
          } catch (err) {
            console.error(err.message);
            code = 1;
          }

          setShowOverlay(true);
          let qrString;

          if (code === 0) {
            setTransactionStatus("success");
            addTransaction(data.id, sender, amount, 2, time);
            qrString = QR.encode("trans_id+hash",data.id,data.verification_hash);
          } else {
            setFailureMessage("Transaction Failed ❌\n" + messages[code - 1]);
            setTransactionStatus("failure");
            if (code == 30) {
              qrString = QR.encode("code+hash",30,data.verification_hash);
            } else {
              qrString = QR.encode("code",1);
            }
          }
          //makeQR
          setQrData(qrString);
          setHideQRCode(false);

          setShowOverlay(false);

          //convey status
          if (data && data.code === 0) {
            setBackgroundColor("bg-green-500");
          } else {
            setBackgroundColor("bg-red-500");
          }
          return;
        } else {
          requestAnimationFrame(scan);
        }
      };

      requestAnimationFrame(scan);

      // Clean up on component unmount
      const stopStream = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      window.addEventListener("beforeunload", stopStream);
      return () => {
        stopStream();
        window.removeEventListener("beforeunload", stopStream);
      };
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen items-center justify-center ${backgroundColor} w-full px-4`}
    >
      <header className="fixed top-0 left-0 right-0 p-4 bg-blue-600 text-white text-xl font-semibold shadow-md text-center w-full z-10">
        <button
          className="absolute top-3 left-4 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => navigate(-1)}
          style={{ background: "none" }}
        >
          <FaArrowLeft className="text-2xl" />
        </button>
        Receive Money
      </header>

      {/* QR Code Display */}
      <div className="p-4 z-1000 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg mt-30 shadow-lg">
        <div
          className="relative"
          style={{
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "10px",
            width: "320px",
            height: "320px",
          }}
        >
          {!hideQRCode && <QRCodeSVG value={qrData} size={290} level="H" />}
          {showOverlay && (
            <div className="absolute inset-0 bg-white rounded-lg opacity-100 flex items-center justify-center">
              <ClipLoader size={50} color="#120525" />
            </div>
          )}
        </div>
      </div>

      {!isAmountDisabled && (
        <>
          <div className="relative mb-20 w-full max-w-md mt-4">
            <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="tel"
              className="pl-10 p-3 w-full border border-gray-300 rounded-lg text-center text-lg bg-white bg-opacity-20 backdrop-blur-lg cursor-pointer"
              placeholder="Enter Amount"
              value={uamount}
              onChange={handleInputChange}
            />
          </div>

          <button
            className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg shadow-lg hover:bg-blue-600 transition mb-4"
            onClick={generateQRCode}
          >
            Offline Sender
          </button>
        </>
      )}

      {isAmountDisabled && (
        <div className="w-full max-w-md relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-lg border border-gray-300"
            style={{
              width: "100vw",
              height: "300px",
              maxHeight: "100vh",
              objectFit: "cover",
              transform: "rotateY(180deg)",
            }}
          />
          {transactionStatus && (
            <div
              className={`absolute inset-0 flex items-center justify-center rounded-lg text-3xl font-bold ${
                transactionStatus === "success"
                  ? "bg-white/80 text-green-700"
                  : "bg-white/80 text-red-700"
              }`}
            >
              {transactionStatus === "success"
                ? "Transaction Success ✅"
                : failureMessage}
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ReceivePage;
