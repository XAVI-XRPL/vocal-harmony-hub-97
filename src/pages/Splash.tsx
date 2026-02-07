import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import splashImage from "@/assets/RVMT.png";

interface SplashProps {
  onComplete: () => void;
}

const FALLBACK_DURATION = 3000; // Fallback timer if video fails
const VIDEO_PLAY_TIMEOUT = 1500; // Max wait for video to start playing
const MIN_DISPLAY_TIME = 2000; // Minimum time to show splash

export default function Splash({ onComplete }: SplashProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoState, setVideoState] = useState<'loading' | 'playing' | 'fallback'>('loading');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideoStartedRef = useRef(false);
  const mountTimeRef = useRef(Date.now());
  const exitTriggeredRef = useRef(false);

  // Trigger exit with minimum display time enforcement
  const triggerExit = useCallback(() => {
    if (exitTriggeredRef.current) return;
    
    const elapsed = Date.now() - mountTimeRef.current;
    const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);
    
    setTimeout(() => {
      exitTriggeredRef.current = true;
      setIsExiting(true);
      
      // Complete after fade-out animation
      setTimeout(() => {
        onComplete();
      }, 600);
    }, remainingTime);
  }, [onComplete]);

  // Handle video events
  const handleVideoPlaying = useCallback(() => {
    if (!hasVideoStartedRef.current) {
      hasVideoStartedRef.current = true;
      setVideoState('playing');
    }
  }, []);

  const handleVideoError = useCallback(() => {
    if (import.meta.env.DEV) console.log('Splash video error - using fallback');
    setVideoState('fallback');
    triggerExit();
  }, [triggerExit]);

  const handleVideoEnded = useCallback(() => {
    triggerExit();
  }, [triggerExit]);

  // Try to play video and handle autoplay restrictions
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let playTimeout: ReturnType<typeof setTimeout>;
    let fallbackTimeout: ReturnType<typeof setTimeout>;

    const attemptPlay = async () => {
      try {
        await video.play();
      } catch (error) {
        if (import.meta.env.DEV) console.log('Splash video autoplay blocked - using fallback');
        setVideoState('fallback');
      }
    };

    // Attempt to play once video can play
    video.addEventListener('canplay', attemptPlay, { once: true });

    // If video doesn't start playing within timeout, use fallback
    playTimeout = setTimeout(() => {
      if (!hasVideoStartedRef.current) {
        if (import.meta.env.DEV) console.log('Splash video play timeout - using fallback');
        setVideoState('fallback');
      }
    }, VIDEO_PLAY_TIMEOUT);

    // Fallback timer in case video never loads/plays
    fallbackTimeout = setTimeout(() => {
      if (!exitTriggeredRef.current) {
        triggerExit();
      }
    }, FALLBACK_DURATION);

    return () => {
      clearTimeout(playTimeout);
      clearTimeout(fallbackTimeout);
      video.removeEventListener('canplay', attemptPlay);
    };
  }, [triggerExit]);

  // Progress bar animation
  useEffect(() => {
    const duration = videoState === 'playing' ? 2500 : FALLBACK_DURATION;
    const interval = duration / 50;
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, interval);

    return () => clearInterval(progressInterval);
  }, [videoState]);

  return (
    <AnimatePresence mode="wait">
      {!isExiting && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-50 bg-black"
          style={{ height: "100dvh", willChange: "opacity" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeIn" }}
        >
          {/* Full-screen video */}
          <motion.video
            ref={videoRef}
            src="/video/RVMTvideo.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster={splashImage}
            onPlaying={handleVideoPlaying}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            className="absolute inset-0 w-full h-full object-cover object-top md:object-contain"
            style={{ willChange: "opacity, transform" }}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ 
              opacity: videoState !== 'loading' ? 1 : 0, 
              scale: 1 
            }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Fallback image if video fails */}
          {videoState === 'fallback' && (
            <motion.img
              src={splashImage}
              alt="RVMT"
              className="absolute inset-0 w-full h-full object-cover object-top md:object-contain"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}

          {/* Dark overlay gradients for depth */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          {/* Subtle vignette effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)"
            }}
          />

          {/* Minimal loading bar */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="w-32 h-0.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/60 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </motion.div>

          {/* Safe area padding for mobile notches */}
          <div className="absolute inset-x-0 top-0 h-[env(safe-area-inset-top)] bg-black/50" />
          <div className="absolute inset-x-0 bottom-0 h-[env(safe-area-inset-bottom)] bg-black/50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
