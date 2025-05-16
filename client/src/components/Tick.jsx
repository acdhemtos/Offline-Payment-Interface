const Tick = ({ size = 120, autoplay = true, loop = false }) => {
  return (
    <div className="flex items-center justify-center">
      <dotlottie-player
        src="https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie"
        background="transparent"
        speed="1"
        style={{ width: size, height: size }}
        loop={loop}
        autoplay={autoplay}
      ></dotlottie-player>
    </div>
  );
};

export default Tick;
