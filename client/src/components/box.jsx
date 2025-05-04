import React, { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QR } from "../utils/qrFunctions";
import jsQR from "jsqr";

const QRMirror = () => {
  const [qrValue, setQrValue] = useState(""); // Value for the QR code
  const [status, setStatus] = useState(""); // "yellow", "red", "green"
  const [looking, setLooking] = useState(true);
  const videoRef = useRef(null); // Reference for the video element
  const canvasRef = useRef(null); // Reference for the canvas element
  const streamRef = useRef(null); // Reference for the media stream

  const username = "receiver"; // Replace with dynamic username if needed
  const name = "merchant"; // Replace with dynamic name if needed

  const generateQR = (text) => {
    console.log("Generating QR for text:", text);
    setQrValue(text); // Set the value for the QR code
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
      const decoded = QR.decode("sender+name+amount", data);
      if (decoded !== false) {
        console.log("Decoded Data:", decoded);
        setStatus("yellow");
        setLooking(false);

        // Send request to sound.php
        fetch("./api/sound.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...decoded, username }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Response from sound.php:", data);
            if (data.code === 0) {
              const id = data.id;
              const verification_hash = data.verification_hash;
              generateQR(QR.encode("trans_id+verification_hash", id, verification_hash));
              setStatus("green");
            } else {
              setStatus("red");
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
            setStatus("red");
          });
      } else {
        console.log("Failed to decode QR data.");
        setStatus("red");
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
    <div>
      <div
        id="qr-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          background: "white",
         width: "100%",
          padding: "10px",
        }}
      >
        {qrValue ? (
          <QRCodeSVG
            value={qrValue}
            size={280} // Size of the QR code
            bgColor="white"
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
          position: "relative",
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
        <canvas
          ref={canvasRef}
          style={{
            display: "none", // Hide the canvas element
          }}
        ></canvas>
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