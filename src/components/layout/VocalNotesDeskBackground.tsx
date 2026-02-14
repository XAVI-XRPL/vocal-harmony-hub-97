import React, { useState } from "react";
import vocalNotesDeskBg from "@/assets/vocal-notes-desk.png";

export const VocalNotesDeskBackground = React.forwardRef<HTMLDivElement>(
  function VocalNotesDeskBackground(_props, ref) {
    const [isLoaded, setIsLoaded] = useState(false);
    return (
      <div ref={ref} className="fixed inset-0 -z-[5] overflow-hidden">
        {/* Desk image with slow zoom animation */}
        <img
          src={vocalNotesDeskBg}
          alt=""
          onLoad={() => setIsLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover animate-slow-zoom transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Dark overlay for card readability */}
        <div className="absolute inset-0 bg-background/35" />
        
        {/* Gradient overlay for color blending - warm tones to match store aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/70" />
      </div>
    );
  }
);
