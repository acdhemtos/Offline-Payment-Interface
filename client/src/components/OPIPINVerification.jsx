import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import Cookies from "js-cookie";
import md5 from "md5";
import jsQR from "jsqr"; // Import jsQR for QR code scanning

const OPIQRCodeSVG = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Add a canvas reference for QR code scanning
  const [qrData, setQrData] = useState("");
  const [receiverName, setReceiverName] = useState("");

  const { receiver, amount } = location.state || {};
  const adjustedAmount = amount ? amount * 100 : 0; 

  const fetchReceiverName = async (username) => {
    try {
      const response = await fetch("/api/getName.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      if (data && data.name) {
        setReceiverName(data.name);
      }
    } catch (error) {
      console.error("Error fetching receiver name:", error);
    }
  };

  useEffect(() => {
    if (receiver) {
      fetchReceiverName(receiver);
    }
  }, [receiver]);

  useEffect(() => {
    const generateQRData = () => {
      const username = Cookies.get("username");
      const recipientUsername = receiver; 
      const time = Date.now();
      const privateKey = Cookies.get("session_key");
      const hash = md5(`${recipientUsername}${receiverName}${adjustedAmount}${time}${privateKey}`);
      
      
    // Use recipient's username in the QR code data
    const qrDataString = `$\n${username}\n${time}\n${hash}\n$`;
    
    setQrData(qrDataString);
    };

    if (receiverName && amount) {
      generateQRData();
    }
  }, [receiverName, amount]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        alert("Unable to access the webcam.");
      }
    };

    const scanQRCode = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.videoWidth > 0 && video.videoHeight > 0) {
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (context) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw video frame onto the canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Get image data from the canvas
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);

          if (code) {
            console.log("QR Code Data:", code.data);
            if (code.data.includes("0")) {
              alert("Success"); // Show success prompt if QR code contains "0"
            }
          }
        }
      }

      // Repeat the scan every animation frame
      requestAnimationFrame(scanQRCode);
    };

    startCamera();
    scanQRCode();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen bg-gray-100">
      {/* Back Button at top-left */}
      <button
        className="absolute top-4 left-4 bg-red-500 text-white px-6 py-2 rounded-lg text-lg shadow-md hover:bg-red-600 transition"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      {/* QR Code */}
      {qrData && (
        <div className="mt-20">
          <QRCodeSVG
            value={qrData}
            size={300}
            className="mb-6"
          />
        </div>
      )}

      {/* Webcam Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-md border border-gray-300 rounded-lg opacity-[30%]"
      />

      {/* Canvas for QR Code Scanning */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
      />
    </div>
  );
};

export default OPIQRCodeSVG;