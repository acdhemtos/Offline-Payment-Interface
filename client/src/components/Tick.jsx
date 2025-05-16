const Tick = ({ size = 120, autoplay = true, loop = false }) => {
  return (
    <div className="flex items-center justify-center">
      <dotlottie-player
        src="https://lottie.host/your-tick-animation.lottie"
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
