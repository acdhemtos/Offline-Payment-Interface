import React, { useEffect, useState } from "react";
import {QRCodeSVG } from "qrcode.react";
import { QR } from "../utils/qrFunctions";
import Cookies from "js-cookie";

const QRMirror = () => {
  const [qrValue, setQrValue] = useState(""); // Value for the QR code
  const [status, setStatus] = useState(""); // "yellow", "red", "green"
  const [looking, setLooking] = useState(true);

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
        }}
      >
        <div
          id="reader"
          style={{
            width: "500px",
            height: "500px",
            border: "2px solid black",
          }}
        >
          {/* Placeholder for camera feed or additional content */}
          <p style={{ textAlign: "center", marginTop: "200px" }}>Camera feed placeholder</p>
        </div>
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