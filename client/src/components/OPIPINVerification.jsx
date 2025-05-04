import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import Cookies from "js-cookie";
import sha256 from "../utils/sha256";
import { QR } from "../utils/qrFunctions";
import jsQR from "jsqr";
import { FaArrowLeft } from "react-icons/fa";
import { addTransaction } from "../utils/transactions";

const OPIQRCodeSVG = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrData, setQrData] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("bg-gray-200");
  const [showOverlay, setShowOverlay] = useState(false);
  const [hideQRCode, setHideQRCode] = useState(false);
  const { receiver, amount, rN } = location.state || {};
  const detailsHashRef = useRef("");
  const ti = useRef("");
  // const [privateKey, setPrivateKey] = useState(null);

  const adjustedAmount = amount ? Math.round(amount * 100) : 0;

  useEffect(() => {
    if (receiver) {
      setReceiverName(receiver);
    }
  }, [receiver]);


  useEffect(() => {
    const generateQRData = async () => {
      const username = Cookies.get("username");
      const time = Date.now();
      ti.current = time;
      const privateKey = Cookies.get("private_key");
      

      sha256(receiver+adjustedAmount+rN+time+privateKey).then(hash => {
        console.log(receiver, adjustedAmount, rN, time, privateKey);
        detailsHashRef.current = QR.decode("hash",hash).hash;
        console.log("detailshash",detailsHashRef.current);
        const qrDataString = QR.encode("username+time",username,time) + hash;
        setQrData(qrDataString);
      });
      
      

      
    };

    if (receiver && amount) {
      generateQRData();
    }
  }, [receiver, amount]);

  useEffect(() => {
    const startCamera = async () => {
      console.log(Date.now());
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          const video = videoRef.current;
          if (!video) return;

          video.srcObject = stream;

          video
            .play()
            .then(() => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d", { willReadFrequently: true });
              console.log("1");
              const scanQRCode = () => {
                if (video.readyState !== 4) {
                  requestAnimationFrame(scanQRCode);
                  return;
                }

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(
                  0,
                  0,
                  canvas.width,
                  canvas.height
                );
                const code = jsQR(imageData.data, canvas.width, canvas.height);

                if (code) {
                  
                  const private_key = Cookies.get("private_key");
                  const string = code.data;
                  const n = string.length;

                  if (QR.decode("code",string).code === 1) {
                    stopStream(video);
                    setShowOverlay(true);
                    setHideQRCode(true);
                    setBackgroundColor("bg-red-500");
                  } else if (QR.decode("code+verification_hash",string) !== false) {
                    const {code,verification_hash} = QR.decode("code+verification_hash",string);
                    if (code === 30) {
                      const sss = detailsHashRef.current + "30" + private_key;
                      sha256(sss).then((ourHash) => {
                        if (verification_hash === ourHash) {
                          stopStream(video);
                          setShowOverlay(true);
                          setHideQRCode(true);
                          setBackgroundColor("bg-red-500");
                        } else {
                          console.log("HASH FAILED", sss, verification_hash, ourHash);
                        }
                      });
                    }
                  } else if (QR.decode("trans_id+verification_hash", string) !== false) {
                    const { trans_id, verification_hash } = QR.decode("trans_id+verification_hash", string);
                    const id = trans_id;
                    const sss =
                      detailsHashRef.current +
                      "0" +
                      id.toString() +
                      private_key;
                    console.log("hashref", detailsHashRef.current);
                    console.log(sss);
                    sha256(sss).then((ourHash) => {
                      if (verification_hash === QR.decode("hash",ourHash).hash) {
                        stopStream(video);
                        setShowOverlay(true);
                        setHideQRCode(true);
                        setBackgroundColor("bg-green-500");
                        // addTransaction(
                        //   id,
                        //   receiverName,
                        //   amount,
                        //   -2,
                        //   ti.current
                        // );
                      } else {
                        console.log(
                          "HASH FAILED",
                          sss,
                          detailsHashRef.current,
                          QR.decode("hash",ourHash).hash,
                          verification_hash
                        );
                      }
                    });
                  }
                }

                requestAnimationFrame(scanQRCode);
              };

              requestAnimationFrame(scanQRCode);

              const stopStream = (video) => {
                if (video.srcObject) {
                  const stream = video.srcObject;
                  const tracks = stream.getTracks();
                  tracks.forEach((track) => track.stop());
                  video.srcObject = null;
                }
              };

              window.addEventListener("beforeunload", () => {
                stopStream(video);
              });

              return () => {
                stopStream(video);
                window.removeEventListener("beforeunload", stopStream);
              };
            })
            .catch((error) => console.error("Error playing video:", error));
        })
        .catch((error) =>
          console.error("Error accessing media devices:", error)
        );
    };

 
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div
      className={`relative flex flex-col items-center justify-start min-w-[100vw] min-h-screen ${backgroundColor}`}
    >
      <button
        className="absolute top-4 left-4 bg-red-500 text-white px-6 py-2 rounded-lg text-lg shadow-md hover:bg-red-600 transition z-50"
        onClick={() => navigate("/app/home")}
      >
        <FaArrowLeft className="text-2xl" />
      </button>

      {qrData && !hideQRCode && (
        <div className="mt-20">
          <QRCodeSVG value={qrData} size={300} className="mb-6" />
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-md border border-gray-300 rounded-lg opacity-[30%]"
      />

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none transform-rotate-180"
        style={{transform: "rotateY(180deg)"}}
      />
      {showOverlay && backgroundColor === "bg-green-500" && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-70 z-40">
          <div className="text-2xl font-semibold text-green-500">
            Transaction Successful
          </div>
        </div>
      )}

      {showOverlay && backgroundColor !== "bg-green-500" && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default OPIQRCodeSVG;
