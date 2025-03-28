import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import AuthLayout from "@/components/authentication/auth-layout";
import AuthButton from "@/components/authentication/auth-button";
import useTimedError from "@/hooks/timed-error";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useTimedError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      // API simulation call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to dashboard or home page after successful login
      window.location.href = "/admin";
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // Right side content that will be displayed in the AuthLayout
  const rightSideContent = (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-4xl text-center"
    >
      <h2 className="text-6xl font-bold mb-6">
        Unlock Your Potential with ITCA
      </h2>
      <p className="text-lg text-white/80 mb-8">
        Access exclusive resources, connect with industry professionals, and
        enhance your skills in information technology and communication.
      </p>

      <div className="flex justify-center space-x-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center hover:translate-y-3 hover:transition-all hover: duration-300">
          <div className="text-2xl font-bold text-amber-500">20+</div>
          <div className="text-sm text-white/80">Events</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center hover:translate-y-3 hover:transition-all hover: duration-300">
          <div className="text-2xl font-bold text-amber-500">15+</div>
          <div className="text-sm text-white/80">Members</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center hover:translate-y-3 hover:transition-all hover: duration-300">
          <div className="text-2xl font-bold text-amber-500">2+</div>
          <div className="text-sm text-white/80">Partners</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout
      title="Sign In"
      rightSideContent={rightSideContent}
      description="Sign in to your ITCA account"
    >
      <>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-600 mb-8">
          Sign in to your account to continue
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                id="email"
                type="email"
                value={email}
                placeholder="your.email@utg.edu.gm"
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-700 hover:text-blue-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                id="password"
                value={password}
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <AuthButton
            type="submit"
            isLoading={isLoading}
            loadingText="Signing in..."
          >
            Sign in
          </AuthButton>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Do not have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-blue-700 hover:text-blue-600 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </>
    </AuthLayout>
  );
};

export default SignIn;
