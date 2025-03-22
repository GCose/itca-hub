import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, ShieldCheck, AlertTriangle } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "sonner";
import AuthLayout from "@/components/ui/layouts/auth-layout";
import AuthButton from "@/components/ui/auth-button";
import PasswordStrengthIndicator from "@/components/ui/sign-up/password-strength-indicator";

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [resetComplete, setResetComplete] = useState(false);

  useEffect(() => {
    // Verify token validity when component mounts
    const verifyToken = async () => {
      if (!token) return;

      try {
        // API call would go here to verify the token - Ebrima Mbye
        // Example: const response = await api.verifyResetToken(token as string);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // For demo purposes assume token is valid
        setIsTokenValid(true);
      } catch {
        setIsTokenValid(false);
        setError("This password reset link is invalid or has expired.");
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsLoading(true);

      // API call would go here
      // Example: await api.resetPassword({ token: token as string, password });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      setResetComplete(true);
      toast.success("Password has been reset successfully", {
        description: "You can now sign in with your new password",
        duration: 5000,
      });
    } catch (err) {
      setError(
        "An error occurred while resetting your password. Please try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Right side content that will be displayed in the AuthLayout
  const rightSideContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-4xl text-center"
    >
      <h2 className="text-5xl font-bold mb-6">Secure Your Account</h2>
      <p className="text-lg text-white/80 mb-8">
        Creating a strong password helps keep your ITCA account and personal
        information secure.
      </p>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
        <h3 className="font-semibold text-lg mb-4">Password Tips</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <ShieldCheck className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <span className="text-sm">
              Use a mix of letters, numbers, and symbols
            </span>
          </li>
          <li className="flex items-start">
            <ShieldCheck className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <span className="text-sm">
              Avoid using easily guessable information like birthdays
            </span>
          </li>
          <li className="flex items-start">
            <ShieldCheck className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <span className="text-sm">
              Use a different password for each of your accounts
            </span>
          </li>
          <li className="flex items-start">
            <ShieldCheck className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <span className="text-sm">
              Consider using a password manager for added security
            </span>
          </li>
        </ul>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout
      title="Reset Password"
      rightSideContent={rightSideContent}
      description="Create a new password for your ITCA account"
    >
      <>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-600 mb-8">
          Create a new secure password for your account
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!isTokenValid ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center p-6 bg-amber-50 rounded-lg border border-amber-100"
          >
            <div className="mb-4 flex justify-center">
              <AlertTriangle className="h-12 w-12 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Invalid or Expired Link
            </h2>
            <p className="text-gray-600 mb-6">
              This password reset link is no longer valid. Please request a new
              one.
            </p>
            <Link href="/auth/forgot-password">
              <AuthButton>Request New Link</AuthButton>
            </Link>
          </motion.div>
        ) : resetComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center p-6 bg-green-50 rounded-lg border border-green-100"
          >
            <div className="mb-4 flex justify-center">
              <ShieldCheck className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Password Reset Complete
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now sign in
              with your new password.
            </p>
            <Link href="/auth">
              <AuthButton>Sign In</AuthButton>
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
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

              {/* Password strength indicator */}
              <PasswordStrengthIndicator password={password} />
            </div>

            <div className="mb-8">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  required
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  Passwords do not match
                </p>
              )}
            </div>

            <AuthButton
              type="submit"
              isLoading={isLoading}
              loadingText="Resetting password..."
            >
              Reset Password
            </AuthButton>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link
              href="/auth"
              className="text-blue-700 hover:text-blue-600 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </>
    </AuthLayout>
  );
};

export default ResetPassword;
