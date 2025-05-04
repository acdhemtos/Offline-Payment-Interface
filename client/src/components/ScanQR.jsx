import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import jsQR from "jsqr";
import { motion } from "framer-motion";
import parseInput from "../utils/backqrValid"; // Import the validation function
import { QR } from "../utils/qrFunctions";

const ScanQR = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    };
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleScanComplete = (data) => {
    if (data) {
      // alert(`Length of scanned data: ${data.length}`);
      let obj = QR.decode("username", data);
      
      
  
      if(obj!==false){
        navigate("/app/send", {
          state: {
            qrData: obj,
            disableUserId: true,
            disableName: false,
            disableAmount: false,
          },
        });
        return;
      }
      obj = QR.decode("username+amount",data);
      if(obj!==false){
        navigate("/app/send", {
          state: {
            qrData: obj,
            disableUserId: true,
            disableName: true,
            disableAmount: false,
          },
        });
        return;
      }

      obj = QR.decode("username+amount+name",data)
      if(obj!==false){
        navigate("/app/send", {
          state: {
            qrData: obj,
            disableUserId: true,
            disableName: true,
            disableAmount: true,
            showOpiOption: true,
          },
        });
        return;
      }
      obj = QR.decode("sender+name",data)
      if (obj !== false) {
        navigate("/app/send", {
          state: {
            qrData: obj,
            sender: obj.sender,
            name: obj.name,
            disableUserId: true,
            disableName: true,
            disableAmount: false,
            showOpiOption: true,
          },
        });
        return;
      }

    }
  };

  const drawCanvas = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.videoWidth > 0 && video.videoHeight > 0) {
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const boxSize = 250;
        const x = (canvas.width - boxSize) / 2;
        const y = (canvas.height - boxSize) / 2;

        const imageData = context.getImageData(x, y, boxSize, boxSize);
        if (imageData && imageData.data) {
          const code = jsQR(imageData.data, boxSize, boxSize);

          if (code) {
            handleScanComplete(code.data);
          }
        }
      }
    }

    requestAnimationFrame(drawCanvas);
  };

  useEffect(() => {
    drawCanvas();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <button
        className="absolute top-4 left-4 text-white px-4 py-2 rounded-lg"
        style={{ zIndex: 100 }}
        onClick={() => navigate("/app/home")}
      >
        <FaArrowLeft className="text-xl" />
      </button>

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-20"
      />

      {error && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-50">
          {error}
        </div>
      )}

      <motion.div
        className="absolute  border-4 rounded-xl border-white"
        style={{
          width: "230px",
          height: "230px",
          top: "30%",
          left: "12%",
          transform: "translate(-50%, -50%)",
          zIndex: 30,
        }}
        animate={{
          borderColor: [
            "rgba(255, 255, 255, 0)",
            "rgba(255, 255, 255, 1)",
            "rgba(255, 255, 255, 0)",
          ],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    </div>
  );
};

export default ScanQR;
