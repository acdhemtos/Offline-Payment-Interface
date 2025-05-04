import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import QRCode from "qrcode-generator";

const QRMirror = () => {
  const [qrOutput, setQrOutput] = useState("");
  const [status, setStatus] = useState(""); // "yellow", "red", "green"
  const [looking, setLooking] = useState(true);
  const readerRef = useRef(null);
  const username = "receiver"; // Replace with dynamic username if needed
  const name = "merchant"; // Replace with dynamic name if needed

  const map = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", " ",
  ];

  const index = {
    username: { from: 0, to: 36 },
    name: { from: 10, to: 37 },
  };

  const lengths = {
    username: 10,
    name: 37,
  };

  const encode = {
    username: (str) => makeIndexArray(str, index.username, 10),
    name: (str) => makeIndexArray(str, index.name, 37),
  };

  const decode = {
    username: (arr) => makeStr(arr, index.username),
    name: (arr) => makeStr(arr, index.name),
  };

  const makeIndexArray = (str, limits, size) => {
    const { from, to } = limits;
    const arr = map.slice(from, to);
    const n = BigInt(arr.length);
    const n1 = n + BigInt(1);
    let num = BigInt(0);
    for (let ch of str) {
      num *= n1;
      num += n - BigInt(arr.indexOf(ch));
    }
    return number(num, size);
  };

  const makeStr = (arr, limits) => {
    const { from, to } = limits;
    const ARR = map.slice(from, to);
    const n = BigInt(ARR.length);
    const n1 = n + BigInt(1);
    let num = number(arr);
    let str = "";
    while (num !== 0) {
      str += ARR[n - (num % n1)];
      num /= n1;
    }
    return str.split("").reverse().join("");
  };

  const number = (num, size) => {
    let str = "";
    num = BigInt(num);
    while (size > 0) {
      str = String.fromCharCode(Number(num % BigInt(256))) + str;
      num /= BigInt(256);
      --size;
    }
    return str;
  };

  const generateQR = (text) => {
    const typeNumber = 0;
    const errorCorrectionLevel = "H";
    const qr = QRCode(typeNumber, errorCorrectionLevel);
    qr.addData(text);
    qr.make();
    setQrOutput(qr.createDataURL());
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
    generateQR(QR.encode("username+name", username, name));

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
      html5QrCode.stop().catch((err) => console.error("Stop failed", err));
    };
  }, []);

  return (
    <div>
      <div id="qr-container">
        <img id="qr-output" src={qrOutput} alt="QR Code" />
      </div>
      <div id="camera-container" className={status}>
        <div id="reader" ref={readerRef}></div>
      </div>
      {status && (
        <button onClick={resetState} style={{ marginTop: "20px" }}>
          Reset
        </button>
      )}
    </div>
  );
};

export default QRMirror;