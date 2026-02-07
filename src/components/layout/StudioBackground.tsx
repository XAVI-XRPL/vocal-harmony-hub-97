import React, { useState } from "react";
import studioBackground from "@/assets/studio-background.png";

export const StudioBackground = React.forwardRef<HTMLDivElement>(
  function StudioBackground(_props, ref) {
    const [isLoaded, setIsLoaded] = useState(false);
    return (
      <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden">
        {/* Studio image with slow zoom animation */}
        <img
          src={studioBackground}
          alt=""
          onLoad={() => setIsLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover animate-slow-zoom transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Dark overlay for card readability */}
        <div className="absolute inset-0 bg-background/40" />

        {/* Gradient overlay for color blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/60" />
      </div>
    );
  }
);
