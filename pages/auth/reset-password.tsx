import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  KeyRound,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import AuthLayout from "@/components/ui/layouts/auth-layout";
import AuthButton from "@/components/ui/auth-button";
import PasswordStrengthIndicator from "@/components/ui/sign-up/password-strength-indicator";

// Defining the DTO for reset password API call
interface ResetPasswordDTO {
  resetToken: string;
  newPassword: string;
}

const ResetPassword = () => {
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetComplete, setResetComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resetToken) {
      setError("Please enter the reset code from your email");
      toast.error("Reset code required", {
        description: "Please check your email for the code",
      });
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      toast.error("Password too short", {
        description: "Please use at least 8 characters for security",
      });
      return;
    }

    try {
      setIsLoading(true);
      const toastId = toast.loading("Resetting password...");

      // Prepare the DTO
      const resetPasswordData: ResetPasswordDTO = {
        resetToken,
        newPassword,
      };

      // API call would go here - Ebrima Mbye
      // Example: await api.resetPassword(resetPasswordData);
      console.log("Sending to backend:", resetPasswordData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      setResetComplete(true);
      toast.success("Password has been reset successfully", {
        id: toastId,
        description: "You can now sign in with your new password",
        duration: 5000,
      });
    } catch (err) {
      setError("Invalid or expired reset code. Please try again.");
      toast.error("Password reset failed", {
        description: "Please check your code and try again",
      });
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
        Enter the verification code sent to your email and create a new secure
        password for your ITCA account.
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
          Enter the verification code from your email and create a new secure
          password
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetComplete ? (
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
                htmlFor="resetToken"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reset Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  required
                  id="resetToken"
                  value={resetToken}
                  placeholder="Enter the code from your email"
                  onChange={(e) => setResetToken(e.target.value)}
                  className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Check your inbox, spam and junk folders for the verification
                code
              </p>
            </div>

            <div className="mb-8">
              <label
                htmlFor="newPassword"
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
                  id="newPassword"
                  value={newPassword}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setNewPassword(e.target.value)}
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
              <PasswordStrengthIndicator password={newPassword} />
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
