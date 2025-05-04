import React, { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QR } from "../utils/qrFunctions";
import Cookies from "js-cookie";

const QRMirror = () => {
  const [qrValue, setQrValue] = useState(""); // Value for the QR code
  const [status, setStatus] = useState(""); // "yellow", "red", "green"
  const [looking, setLooking] = useState(true);
  const videoRef = useRef(null); // Reference for the video element
  const streamRef = useRef(null); // Reference for the media stream

  // Get username from cookies or set default
  const username = "receiver";
  const name = "merchant";

  const generateQR = (text) => {
    console.log("Generating QR for text:", text);
    setQrValue(text); // Set the value for the QR code
    console.log("QR Code Value Set:", text);
  };

  const resetState = () => {
    setStatus("");
    setLooking(true);
    generateQR(QR.encode("username+name", username, name));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use the back camera
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

  useEffect(() => {
    // Start the camera feed when the component mounts
    startCamera();

    // Stop the camera feed when the component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    // Generate the initial QR code
    generateQR(QR.encode("username+name", username, name));
    console.log("Initial QR code generated for:", username, name);
  }, [username, name]);

  return (
    <div>
      <div
        id="qr-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "2px",
          background: "white",
         width: "100%",
          padding: "2px",
        }}
      >
        {qrValue ? (
          <QRCodeSVG
            value={qrValue}
            size={280} // Size of the QR code
       bgColor="white"
       margin="10px"
            fgColor={status === "green" ? "green" : status === "red" ? "red" : "black"}
            level="H" // Error correction level
          />
        ) : (
          <div
            style={{
              width: "300px",
              height: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px dashed #ccc",
            }}
          >
            Loading QR Code...
          </div>
        )}
      </div>
      <div
        id="camera-container"
        className={status}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "500px",
            height: "500px",
            border: "2px solid black",
            objectFit: "cover", // Ensure the video fills the container
          }}
        ></video>
      </div>
      {status && (
        <button
          onClick={resetState}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default QRMirror;