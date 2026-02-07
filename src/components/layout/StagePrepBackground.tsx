import { useState } from "react";
import stagePrepBg from "@/assets/stage-prep-bg.png";

export function StagePrepBackground() {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <img
        src={stagePrepBg}
        alt=""
        onLoad={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover animate-slow-zoom transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 bg-background/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/70" />
    </div>
  );
}
