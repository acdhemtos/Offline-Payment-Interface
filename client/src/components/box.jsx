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
  const username = "receiver";
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
          });
      }
    }
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          html5QrCode
            .start(
              { facingMode: "user" },
              { fps: 10 },
              onScanSuccess
            )
            .catch((err) => console.error("Start failed", err));
        }
      })
      .catch((err) => console.error("Camera error", err));

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch((err) => console.error("Stop failed", err));
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
        <img
          id="qr-output"
          src={qrOutput}
          alt="QR Code"
          style={{
            width: "300px", // Adjust the width of the QR code
            height: "300px", // Adjust the height of the QR code
          }}
        />
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
            width: "500px", // Adjust the width of the webcam feed
            height: "500px", // Adjust the height of the webcam feed
            border: "2px solid black", // Optional: Add a border for better visibility
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
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default QRMirror;