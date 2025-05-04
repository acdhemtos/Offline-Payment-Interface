import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import QRCode from "qrcode-generator";
import { QR } from "../utils/qrFunctions";
import Cookies from "js-cookie";

const QRMirror = () => {
  const [qrOutput, setQrOutput] = useState("");
  const [status, setStatus] = useState(""); // "yellow", "red", "green"
  const [looking, setLooking] = useState(true);
  const readerRef = useRef(null);
  
  // Get username from cookies or set default
  const username =  "receiver";
  const name = "merchant";

  const generateQR = (text) => {
    console.log("Generating QR for text:", text);
    const typeNumber = 0;
    const errorCorrectionLevel = "H";
    const qr = QRCode(typeNumber, errorCorrectionLevel);
    qr.addData(text);
    qr.make();
    setQrOutput(qr.createDataURL());
    console.log("QR Code Generated");
  };

  const resetState = () => {
    setStatus("");
    setLooking(true);
    generateQR(QR.encode("username+name", username, name));
  };

  const onScanSuccess = (decodedText) => {
    if (looking) {
      console.log("QR code scanned:", decodedText);
      const ret = QR.decode("sender+amount+time+details_hash", decodedText);
      if (ret !== false) {
        setLooking(false);
        setStatus("yellow");

        fetch("./api/soundBox.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...ret, username }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("API response:", data);
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
            console.error("AJAX Error:", error);
            setStatus("red");
            generateQR(QR.encode("code", 99)); // Generic error code
          });
      }
    }
  };

  // Initialize QR code on component mount
  useEffect(() => {
    // Generate the initial QR code
    generateQR(QR.encode("username+name", username, name));
   console.log(username, name);
    console.log("Initial QR code generated for:", username, name);
  }, [username, name]);

  // Set up camera
  useEffect(() => {
    let html5QrCode = null;
    
    try {
      html5QrCode = new Html5Qrcode("reader");
      
      Html5Qrcode.getCameras()
        .then((devices) => {
          console.log("Cameras found:", devices);
          if (devices && devices.length) {
            const cameraId = devices[0].id;
            console.log("Starting camera with ID:", cameraId);
            
            html5QrCode
              .start(
                { facingMode: "environment" }, // Change to "environment" for back camera
                { fps: 10, qrbox: { width: 300, height: 400 }, },
                onScanSuccess,
                // (errorMessage) => {
                //   // QR code not found, continue scanning
                // }
              )
              .catch((err) => console.error("Camera start failed:", err));
          } else {
            console.warn("No cameras found");
          }
        })
        .catch((err) => console.error("Get cameras error:", err));
    } catch (error) {
      console.error("Camera initialization error:", error);
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch((err) => console.error("Stop camera failed:", err));
      }
    };
  }, []);

  return (
    <div>
      <div
        id="qr-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          
        }}
      >
        {qrOutput ? (
          <img
            id="qr-output"
            src={qrOutput}
            alt="QR Code"
            style={{
              width: "400px",
              height: "300px",
              border: status === "green" ? "4px solid green" : 
                     status === "red" ? "4px solid red" : 
                     status === "yellow" ? "4px solid orange" : "none"
            }}
          />
        ) : (
          <div style={{ width: "300px", height: "300px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px dashed #ccc" }}>
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
        <div
          id="reader"
          ref={readerRef}
          style={{
            width: "500px",
            height: "500px",
            border: "2px solid black",
          }}
        ></div>
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
            cursor: "pointer"
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default QRMirror;