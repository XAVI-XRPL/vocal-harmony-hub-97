import React from "react";
import vocalNotesDeskBg from "@/assets/vocal-notes-desk.png";

export const VocalNotesDeskBackground = React.forwardRef<HTMLDivElement>(
  function VocalNotesDeskBackground(_props, ref) {
    return (
      <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden">
        {/* Desk image with slow zoom animation */}
        <img
          src={vocalNotesDeskBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
        />
        
        {/* Dark overlay for card readability */}
        <div className="absolute inset-0 bg-background/35" />
        
        {/* Gradient overlay for color blending - warm tones to match store aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/70" />
      </div>
    );
  }
);
