import { useEffect, useRef } from "react";
import { DotLottie } from "@lottiefiles/dotlottie-web";

const Tick = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const dotLottie = new DotLottie({
      autoplay: true,
      loop: false,
      canvas: canvasRef.current,
      src: "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie",
    });

    // Cleanup
    return () => {
      dotLottie.destroy(); // Release memory
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} width="150" height="150" />
    </div>
  );
};

export default Tick;
