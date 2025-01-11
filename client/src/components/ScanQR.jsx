import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRelativePath } from "../utils/utils";
import { FaArrowLeft } from "react-icons/fa";
import jsQR from "jsqr"; 
import { motion } from "framer-motion";

const ScanQR = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {

    // Access camera for scanning
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };
    startCamera();

    return () => {
      // Cleanup function to stop the video stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleScanComplete = (data) => {
    if (data) {
      // QR code is successfully scanned
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      navigate(getRelativePath("/send")); // Redirect to the send route after scan
    }
  };

  const drawCanvas = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Ensure video and canvas are available and video dimensions are set
    if (video && canvas && video.videoWidth > 0 && video.videoHeight > 0) {
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (context) {
        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Define the scan box area
        const boxSize = 250;
        const x = (canvas.width - boxSize) / 2;
        const y = (canvas.height - boxSize) / 2;

        // Get image data from the scan box area
        const imageData = context.getImageData(x, y, boxSize, boxSize);
        if (imageData && imageData.data) {
          const code = jsQR(imageData.data, boxSize, boxSize);

          if (code) {
            handleScanComplete(code);
          }
        }
      }
    }

    // Repeat the drawCanvas every animation frame for continuous scanning
    requestAnimationFrame(drawCanvas);
  };

  useEffect(() => {
    drawCanvas(); // Start drawing canvas as soon as the component mounts
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      {/* Full-Screen Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Back Button */}
      <button
        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        style={{ zIndex: 100 }}
        onClick={() => navigate(getRelativePath("/app/home"))}
      >
        <FaArrowLeft className="text-xl" />
      </button>

      {/* Canvas for QR Code Scan Area */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-20"
      />

            <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold z-50">
        Scan
      </div>

      {/* Animated Scanner Box */}
      <motion.div
        className="absolute border-4 rounded-xl border-white"
        style={{
          width: "250px",
          height: "250px",
          top: "30%",
          left: "17%",
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
