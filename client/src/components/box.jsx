import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import QRCode from "qrcode-generator";
import { QR } from "../utils/qrFunctions";
import Cookies from "js-cookie";

// Custom scanner styles to override default HTML5QrCode styles
const SCANNER_CSS = `
  /* Override the scanner line styles */
  .html5-qrcode-line {
    stroke-width: 8px !important; /* Increase line thickness */
    stroke: #FF3B58 !important; /* Change line color */
    opacity: 0.9 !important;
  }
  
  /* Make corner elements larger */
  #html5-qrcode-anchor-scan-type-change {
    width: 40px !important;
    height: 40px !important;
  }
  
  /* Custom animations for the lines */
  @keyframes dash {
    0% {
      stroke-dashoffset: 25;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  
  .html5-qrcode-line-animating {
    animation: dash 0.5s linear infinite !important;
    stroke-dasharray: 6 8 !important;
  }
`;

const QRMirror = () => {
  const [qrOutput, setQrOutput] = useState("");
  const [status, setStatus] = useState(""); // "yellow", "red", "green"
  const [looking, setLooking] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const readerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  
  // Get username from cookies or set default
  const username = Cookies.get('username') || "receiver";
  const name = "merchant";

  // Apply custom scanner styles
  useEffect(() => {
    // Add custom CSS to document head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = SCANNER_CSS;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
    
    console.log("Initial QR code generated for:", username, name);
  }, [username, name]);

  // Set up camera
  useEffect(() => {
    try {
      // Configure scanner with custom styling options
      const config = {
        fps: 10,
        qrbox: { width: 300, height: 300 },
        aspectRatio: 1.0,
        disableFlip: false,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        },
        lineWidth: 8, // Thicker lines in the QR scanner
        colorDark: "#FF3B58", // Scanner lines color
        rememberLastUsedCamera: true
      };
      
      html5QrCodeRef.current = new Html5Qrcode("reader");
      
      Html5Qrcode.getCameras()
        .then((devices) => {
          console.log("Cameras found:", devices);
          if (devices && devices.length) {
            // Prefer back camera if available
            const backCamera = devices.find(device => 
              /back|rear|environment|back\s*camera/i.test(device.label)
            );
            const cameraId = backCamera ? backCamera.id : devices[0].id;
            
            console.log("Starting camera with ID:", cameraId);
            
            html5QrCodeRef.current
              .start(
                { deviceId: cameraId },
                config,
                onScanSuccess,
                // (errorMessage) => {
                //   // QR code not found, continue scanning
                // }
              )
              .then(() => {
                setCameraActive(true);
                console.log("Camera started successfully");
                
                // Make sure the scanner is visible and has the correct styles
                setTimeout(() => {
                  const scanners = document.querySelectorAll('.html5-qrcode-line');
                  scanners.forEach(scanner => {
                    scanner.setAttribute('stroke-width', '8');
                    scanner.setAttribute('stroke', '#FF3B58');
                  });
                }, 1000);
              })
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
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch((err) => console.error("Stop camera failed:", err));
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
              width: "300px",
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
          position: "relative"
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
        
        {!cameraActive && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "20px",
            borderRadius: "10px"
          }}>
            Initializing camera...
          </div>
        )}
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