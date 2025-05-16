import { useEffect, useRef, useState } from "react";
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
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [amount, setAmount] = useState("");
   const lookingRef = useRef(true);

  const username = "receiver";
  const name = "merchant";

  const generateQR = (text) => {
    console.log("Generating QR for text:", text);
    setQrValue(text);
  };

  const resetState = () => {
    if (statusMessage.includes("Success") && qrValue) {
      const decoded = QR.decode("sender+time+amount+details_hash", qrValue);
      console.log("decoded", decoded);
      announce(amount);
    }

    setStatusMessage("");
    setShowLoader(false);
    setLooking(true);
    lookingRef.current = true;
    generateQR(QR.encode("username+name", username, name));
   startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setStatusMessage("Camera access denied or unavailable ❌");
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
    // if (!video || !looking) return;
     if(!video || !lookingRef.current) return;

    if (video.videoWidth > 0 && video.videoHeight > 0) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        handleScanComplete(code.data);
        return; // Stop scanning after a valid code is found
      }
    }

    requestAnimationFrame(scanQRCode);
  };

  const handleScanComplete = (data) => {
    if (data && lookingRef.current) {
      lookingRef.current = false;
      console.log("Scanned QR Data:", data);
      setLooking(false);
      setShowLoader(true);

      const decoded = QR.decode("sender+time+amount+details_hash", data);
      setAmount(decoded.amount);

      if (decoded !== false) {
        fetch("./api/soundBox.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...decoded, username }),
        })
          .then((response) => response.json())
          .then((data) => {
            setShowLoader(false);
            stopCamera();

            if (data.code === 0) {
              setStatusMessage("Transaction Success ✅");
              const { id: trans_id, verification_hash } = data;
              generateQR(QR.encode("trans_id+verification_hash", trans_id, verification_hash));
            } else {
              setStatusMessage("Transaction Failed ");
              if (data.code === 30) {
                generateQR(QR.encode("code+verification_hash", 30, data.verification_hash));
              } else {
                generateQR(QR.encode("code", 1));
              }
            }
          })
          .catch((error) => {
            console.error("Error sending request to sound.php:", error);
            setStatusMessage("Network Error ❌");
            setShowLoader(false);
            stopCamera();
          });
      } else {
        setStatusMessage("Invalid QR Code ❌");
        setShowLoader(false);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    startCamera();
    scanQRCode();

    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
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
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded-lg border border-gray-300 transform-rotate-180"
          style={{
            width: "500px",
            height: "300px",
            objectFit: "cover",
          }}
        ></video>

        {!looking && statusMessage && (
         <div
         onClick={resetState}
         className={`absolute inset-0 flex items-center justify-center text-lg font-semibold cursor-pointer rounded-lg ${
           statusMessage.includes("Success")
             ? "bg-green-100 text-green-700"
             : "bg-red-100 text-red-700"
         }`}
       >
         {statusMessage}
       </div>
       
        )}
      </div>
    </div>
  );
};

export default QRMirror;
