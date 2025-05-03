import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import Cookies from "js-cookie";
import sha256 from "../utils/sha256";
import { encode, decode } from "../utils/qrFunctions";
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

  const adjustedAmount = amount ? Math.round(amount * 100) : 0;

  useEffect(() => {
    if (receiver) {
      setReceiverName(receiver);
    }
  }, [receiver]);

  useEffect(() => {
    const generateQRData = async () => {
      const username = encode.username(codeURIComponent(Cookies.get("username")));
      const tt = Date.now();
      const time = encode.time(tt);
      ti.current = time;
      //const privateKey = Cookies.get("private_key");
      let privateKey = null;

      if (navigator.credentials) {
        navigator.credentials.get({ password: true }).then((credential) => {
          console.log(credential);
          if (credential) {
            privateKey = credential.password;
          } else {
            console.error("No credential found");
            return;
          }
        })
        
      } else {
        console.error("Cred API error");
        return;
      }

      const hash = await sha256(receiver, adjustedAmount, rN, time, privateKey);
      detailsHashRef.current = hash;

      const qrDataString = username + time + hash;

      setQrData(qrDataString);
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

                  if (n === 1 && decode.code(string) === 1) {
                    stopStream(video);
                    setShowOverlay(true);
                    setHideQRCode(true);
                    setBackgroundColor("bg-red-500");
                  } else if (n === 33) {
                    const code = decode.code(string.slice(0, 1));
                    const hash = string.slice(1, 33);

                    if (code === 30) {
                      const sss = detailsHashRef.current + "30" + private_key;
                      sha256(sss).then((ourHash) => {
                        if (hash === ourHash) {
                          stopStream(video);
                          setShowOverlay(true);
                          setHideQRCode(true);
                          setBackgroundColor("bg-red-500");
                        } else {
                          console.log("HASH FAILED", sss, hash, ourHash);
                        }
                      });
                    }
                  } else if (n === 36) {
                    const id = decode.trans_id(string.slice(0, 4));
                    const verification_hash = string.slice(4, 36);

                    const sss =
                      decode.hash(detailsHashRef.current) +
                      "0" +
                      id.toString() +
                      private_key;
                    sha256(sss).then((ourHash) => {
                      if (verification_hash === ourHash) {
                        stopStream(video);
                        setShowOverlay(true);
                        setHideQRCode(true);
                        setBackgroundColor("bg-green-500");
                        addTransaction(
                          id,
                          receiverName,
                          amount,
                          -2,
                          ti.current
                        );
                      } else {
                        console.log(
                          "HASH FAILED",
                          sss,
                          detailsHashRef.current,
                          ourHash,
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

    //   const video = videoRef.current;
    //   const canvas = canvasRef.current;

    //   if (video && canvas && video.videoWidth > 0 && video.videoHeight > 0) {
    //     const context = canvas.getContext("2d", { willReadFrequently: true });
    //     if (context) {
    //       canvas.width = video.videoWidth;
    //       canvas.height = video.videoHeight;

    //       context.save();
    //       // context.scale(-1, 1);
    //       // context.translate(-canvas.width, 0);

    //       // Draw video frame onto the canvas
    //       context.drawImage(video, 0, 0, canvas.width, canvas.height);
    //       context.restore();

    //       const imageData = context.getImageData(
    //         0,
    //         0,
    //         canvas.width,
    //         canvas.height
    //       );

    //       const code = jsQR(imageData.data, canvas.width, canvas.height);

    //       if (code) {
    //         console.log("QR Code Data:", code.data);
    //         console.log("QR Code Data Length:", code.data.length);

    //         if (videoRef.current && videoRef.current.srcObject) {
    //           const stream = videoRef.current.srcObject;
    //           const tracks = stream?.getTracks?.();
    //           tracks.forEach((track) => track.stop());
    //         }

    //         const messageIndex = parseInt(code.data);
    //         alert(
    //           messages[messageIndex - 1] || "Login failed. Please try again."
    //         );

    //         return;
    //       }
    //     }
    //   }

    //   // Repeat the scan every animation frame
    //   requestAnimationFrame(scanQRCode);
    // };

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
        className="w-full max-w-md border border-gray-300 rounded-lg opacity-[30%] transform scale-x-[-1]"
      />

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none transform scale-x-[-1]"
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
