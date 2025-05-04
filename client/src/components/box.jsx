import React, { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QR } from "../utils/qrFunctions";
import jsQR from "jsqr";
import { ClipLoader } from "react-spinners";
import { announce } from "../utils/announce";

const QRMirror = () => {
  const [qrValue, setQrValue] = useState(""); 
  const [statusMessage, setStatusMessage] = useState(""); 
  const [showLoader, setShowLoader] = useState(false); 
  const [looking, setLooking] = useState(true);
  const [transactionStatus, setTransactionStatus] = useState(""); // For transaction status
  const [failureMessage, setFailureMessage] = useState(""); // For failure messages
  const videoRef = useRef(null); 
  const canvasRef = useRef(null); 
  const streamRef = useRef(null); 
  const [amount, setAmount] = useState("");

  const username = "receiver"; 
  const name = "merchant"; 

  const generateQR = (text) => {
    console.log("Generating QR for text:", text);
    setQrValue(text); // Set the value for the QR code
  };

  const resetState = () => {
    console.log("Reset button clicked");
    if (statusMessage.includes("Success") && qrValue) {
      const decoded = QR.decode("sender+time+amount+details_hash", qrValue);
      console.log("Decoded QR data:", decoded);

      if (decoded && typeof decoded.amount === "number" && !isNaN(decoded.amount)) {
        console.log("Announcing amount:", decoded.amount * 100);
        announce(decoded.amount * 100); // Announce the amount multiplied by 100
      } else {
        console.log("Invalid or missing amount in decoded QR data.");
      }
    } else {
      console.log("Transaction was not successful or QR value is missing.");
    }

    setStatusMessage("");
    setTransactionStatus(""); // Reset transaction status
    setFailureMessage(""); // Reset failure message
    setShowLoader(false);
    setLooking(true);
    generateQR(QR.encode("username+name", username, name));
    startCamera(); // Restart the camera
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // Use the back camera
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream; // Set the video source to the camera stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
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

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          console.log("QR Code detected:", code.data);
          handleScanComplete(code.data);
        }
      }
    }

    if (looking) {
      requestAnimationFrame(scanQRCode);
    }
  };

  const handleScanComplete = (data) => {
    if (data && looking) {
      console.log("Scanned QR Data:", data);
      setLooking(false);
      setShowLoader(true); // Show loader while processing
      const decoded = QR.decode("sender+time+amount+details_hash", data);
      setAmount(decoded.amount);
      console.log("box.js decoded amount", decoded, data);
      console.log(decoded);
      if (decoded !== false) {
        console.log("Decoded Data:", decoded);
        setLooking(false);

        // Send request to sound.php
        fetch("./api/soundBox.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...decoded, username }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Response from sound.php:", data);
            setShowLoader(false); 
            stopCamera();
            if (data.code === 0) {
              setTransactionStatus("success");
              setStatusMessage("Transaction Success ✅");
              const trans_id = data.id;
              const verification_hash = data.verification_hash;
              generateQR(QR.encode("trans_id+verification_hash", trans_id, verification_hash));
              if (decoded.amount) {
                announce(decoded.amount); // Announce the amount
              }
            } else {
              setTransactionStatus("failure");
              setFailureMessage("Transaction Failed ❌");
              if (data.code === 30) {
                const verification_hash = data.verification_hash;
                generateQR(QR.encode("code+verification_hash", 30, verification_hash));
              } else {
                generateQR(QR.encode("code", 1));
              }
            }
          })
          .catch((error) => {
            console.error("Error sending request to sound.php:", error);
            setShowLoader(false); 
            setTransactionStatus("failure");
            setFailureMessage("Transaction Failed ❌ (Network Error)");
          });
      } else {
        console.log("Failed to decode QR data.");
        setShowLoader(false); 
        setTransactionStatus("failure");
        setFailureMessage("Invalid QR Code ❌");
      }
    }
  };

  useEffect(() => {
    // Start the camera feed when the component mounts
    startCamera();

    // Start scanning for QR codes
    scanQRCode();

    // Stop the camera feed when the component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    // Generate the initial QR code
    generateQR(QR.encode("username+name", username, name));
  }, [username, name]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full px-4">
      <div
        id="qr-container"
        className="p-4 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg"
      >
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
          <QRCodeSVG value={qrValue} size={290} level="H" />
          {showLoader && (
            <div className="absolute inset-0 bg-white rounded-lg opacity-100 flex items-center justify-center">
              <ClipLoader size={50} color="#120525" />
            </div>
          )}
        </div>
      </div>

      <div
        id="camera-container"
        className="mt-4 flex justify-center items-center relative"
        style={{ width: "500px", height: "300px" }}
      >
        {transactionStatus ? (
          <div
            onClick={resetState} // Acts as a reset button
            className={`absolute inset-0 flex items-center justify-center rounded-lg text-3xl font-bold cursor-pointer ${
              transactionStatus === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {transactionStatus === "success" ? "Transaction Success ✅" : failureMessage}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-lg border border-gray-300"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          ></video>
        )}
      </div>
    </div>
  );
};

export default QRMirror;