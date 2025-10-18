const Loading = () => {
  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-white">
      {/* Centered Logo */}
      <div className="flex items-center justify-center">
        <img
          src="/main-logo.png"
          alt="Firespot Logo"
          className="w-15"
        />
      </div>

      {/* Bottom Label */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <img
          src="/label.png"
          alt="Firespot Label"
          className="w-30 h-auto"
        />
      </div>
    </div>
  );
};

export default Loading;
