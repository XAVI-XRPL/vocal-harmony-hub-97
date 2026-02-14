import { useState } from "react";
import libraryBackground from "@/assets/library-background.png";

export function LibraryBackground() {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="fixed inset-0 -z-[5] overflow-hidden">
      <img
        src={libraryBackground}
        alt=""
        onLoad={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover animate-slow-zoom transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 bg-background/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/80" />
    </div>
  );
}
