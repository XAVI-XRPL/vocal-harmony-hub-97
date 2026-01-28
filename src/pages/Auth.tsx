import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, Music2 } from "lucide-react";
import { z } from "zod";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

// Validation schemas
const emailSchema = z.string().trim().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, isAuthenticated, isLoading } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(searchParams.get("signup") === "true");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validateFields = () => {
    setFieldErrors({});
    setError(null);

    try {
      if (isSignUp) {
        signupSchema.parse({ email, password, confirmPassword });
      } else {
        loginSchema.parse({ email, password });
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            errors[e.path[0] as string] = e.message;
          }
        });
        setFieldErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFields()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes("already registered")) {
            setError("This email is already registered. Try signing in instead.");
          } else {
            setError(error.message);
          }
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setError("Invalid email or password. Please try again.");
          } else {
            setError(error.message);
          }
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="liquid-blob absolute w-96 h-96 gradient-bg"
          style={{ top: "10%", left: "-10%" }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="liquid-blob absolute w-80 h-80"
          style={{
            bottom: "20%",
            right: "-5%",
            background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--primary)))",
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 flex items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-xl bg-glass border border-glass-border flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-8"
        >
          <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center shadow-xl">
            <Music2 className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold mb-2"
        >
          {isSignUp ? "Create Account" : "Welcome Back"}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-muted-foreground text-sm mb-8"
        >
          {isSignUp ? "Start your musical journey" : "Sign in to continue practicing"}
        </motion.p>

        {/* Auth form */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm"
        >
          <GlassCard padding="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "pl-10 bg-glass border-glass-border",
                      fieldErrors.email && "border-destructive"
                    )}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-destructive">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isSignUp ? "Create a password" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "pl-10 pr-10 bg-glass border-glass-border",
                      fieldErrors.password && "border-destructive"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-destructive">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirm password (signup only) */}
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={cn(
                          "pl-10 bg-glass border-glass-border",
                          fieldErrors.confirmPassword && "border-destructive"
                        )}
                      />
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <GlassButton
                type="submit"
                fullWidth
                disabled={isSubmitting}
                className="mt-6"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isSignUp ? "Create Account" : "Sign In"}
              </GlassButton>
            </form>

            {/* Toggle auth mode */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setFieldErrors({});
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <span className="text-primary font-medium">Sign in</span>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <span className="text-primary font-medium">Create one</span>
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
