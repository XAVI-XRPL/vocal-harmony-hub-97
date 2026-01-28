import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Music4 } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
            top: "10%",
            left: "10%",
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--accent) / 0.15) 0%, transparent 70%)",
            bottom: "20%",
            right: "10%",
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center px-6"
      >
        {/* Animated 404 Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative mx-auto mb-8"
        >
          <motion.div
            className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-glass-border"
            animate={{
              boxShadow: [
                "0 0 30px hsl(var(--primary) / 0.2)",
                "0 0 50px hsl(var(--accent) / 0.3)",
                "0 0 30px hsl(var(--primary) / 0.2)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Music4 className="w-16 h-16 text-primary opacity-50" />
          </motion.div>
          
          {/* Floating 404 text */}
          <motion.div
            className="absolute -top-2 -right-2 w-12 h-12 rounded-full gradient-bg flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-white font-bold text-sm">404</span>
          </motion.div>
        </motion.div>

        {/* Text content */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-3"
        >
          <span className="gradient-text">Lost in the Mix</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto"
        >
          This track doesn't exist. Let's get you back to the music.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <GlassButton
            size="lg"
            icon={<Home className="w-5 h-5" />}
            onClick={() => navigate("/")}
          >
            Back to Home
          </GlassButton>
          <GlassButton
            variant="secondary"
            size="lg"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </GlassButton>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
