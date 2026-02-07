import { useState } from "react";
import recordsWallBackground from "@/assets/records-wall-background.png";

export function RecordsWallBackground() {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Records wall image with slow zoom animation */}
      <img
        src={recordsWallBackground}
        alt=""
        onLoad={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover animate-slow-zoom transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Dark overlay for card readability */}
      <div className="absolute inset-0 bg-background/60" />

      {/* Gradient overlay for color blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80" />
    </div>
  );
}
