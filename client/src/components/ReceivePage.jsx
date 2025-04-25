import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { FaRupeeSign, FaArrowLeft } from "react-icons/fa";
import Cookies from "js-cookie";
import { encode } from "../utils/qrFunctions";
import { AJAX } from "../utils/ajax";
import jsQR from "jsqr";



const ReceivePage = () => {
  const [uamount, setUamount] = useState("");
  const [qrData, setQrData] = useState("");
  const [username, setUsername] = useState("");
  const [isAmountDisabled, setIsAmountDisabled] = useState(false); // Track if amount input is disabled
  const [backgroundColor, setBackgroundColor] = useState("bg-gradient-to-b from-blue-50 to-blue-100"); // Background color state
  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  
  const generateReceiveQR = (amount = "", name=false) => {
    // Encode username
    let qrString = encode.username(Cookies.get("username"));
    if (amount != "" ) {
      console.log(amount,amount*100)
      qrString += encode.amount(amount * 100);
      if (name !== false) {
        qrString += encode.name(name);
      }
    }
  
    console.log("Generated QR Data:", qrString);
    return qrString;
  };

  // Fetch username from API and set it in state
  useEffect(() => {
    const fetchUsername = async () => {
      setQrData(generateReceiveQR());
      
    };

    fetchUsername();
  }, []);

  // Handle input change and dynamically update QR code
  const handleInputChange = (e) => {
    const value = e.target.value;
    const [integerPart, decimalPart] = value.split(".");
    if (decimalPart && decimalPart.length > 2) {
      return; // Prevent input if there are already 2 decimal places
    }
    setUamount(value);
    setQrData(generateReceiveQR(value));
   
  };

 

  const generateQRCode = async () => {
    const name = localStorage.getItem("name");
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
          try {
            
            const parsed = rawValue.split("\n");
            const sender = parsed[1];
            const time = parseInt(parsed[2]);
            const details_hash = parsed[3];
            const amt = uamount * 100;
            const session_key = Cookies.get("session_key");
            const username = Cookies.get("username");
  
            const response = await fetch("/api/receive.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, session_key, amount: amt, sender, time, details_hash }),
            });
  
            const data = await response.json();
            if (data.code === 0) {
              setQrData("0");
              setBackgroundColor("bg-green-500");
  
              // Stop all video tracks
              stream.getTracks().forEach(track => track.stop());
            }
          } catch (err) {
            console.error("QR data parsing error:", err);
          }
        } else {
          requestAnimationFrame(scan); // keep scanning
        }
      };
  
      requestAnimationFrame(scan);
  
      // Clean up on component unmount
      const stopStream = () => {
        stream.getTracks().forEach(track => track.stop());
      };
  
      window.addEventListener("beforeunload", stopStream); // clean up if user closes window
      return () => {
        stopStream();
        window.removeEventListener("beforeunload", stopStream);
      };
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };
  

  return (
    <div className={`flex flex-col min-h-screen items-center justify-center ${backgroundColor} w-full px-4`}>
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
      <div className="p-4 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg mt-10 shadow-lg">
        <QRCodeSVG value={qrData} size={320} level="H" />
      </div>

      {/* Input Box and Button */}
      {!isAmountDisabled && (
        <>
          <div className="relative mb-4 w-full max-w-md mt-4">
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

      {/* Camera Feed */}
      {isAmountDisabled && (
        <div className="w-full max-w-md">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-lg border border-gray-300"
            style={{
              width: "100vw",
              height: "200px",
              maxHeight: "100vh",
              objectFit: "cover",
              transform: "rotateY(180deg)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ReceivePage;