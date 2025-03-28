import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import AuthLayout from "@/components/ui/layouts/auth-layout";
import AuthButton from "@/components/ui/auth-button";
import useTimedError from "@/hooks/timed-error";

// Defining the DTO for forgot password API call
interface ForgotPasswordDTO {
  schoolEmail: string;
}

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useTimedError();
  const [emailSent, setEmailSent] = useState(false);

  // Validate UTG email format
  const isValidUTGEmail = (email: string): boolean => {
    return email.trim().toLowerCase().endsWith("@utg.edu.gm");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your UTG email address");
      return;
    }

    // Strict validation for UTG email format
    if (!isValidUTGEmail(email)) {
      setError(
        "Please enter a valid UTG email address ending with @utg.edu.gm"
      );
      toast.error("Invalid email format", {
        description: "Only UTG email addresses (@utg.edu.gm) are allowed",
      });
      return;
    }

    try {
      setIsLoading(true);
      const toastId = toast.loading("Sending reset code...");

      // Prepare the DTO
      const forgotPasswordData: ForgotPasswordDTO = {
        schoolEmail: email, // Map email to schoolEmail as in RegisterUserDTO, basic stuffs
      };

      // API call would go here - Ebrima Mbye
      // Example: await api.forgotPassword(forgotPasswordData);
      console.log("Sending to backend:", forgotPasswordData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      setEmailSent(true);
      toast.success("Reset code sent to your UTG email", {
        id: toastId,
        description: "Please check your inbox, spam, and junk folders",
        duration: 5000,
      });
    } catch (err) {
      setError("An error occurred. Please try again.");
      toast.error("Failed to send reset code", {
        description: "Please try again later",
      });
      console.error(err);
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
      <h2 className="text-5xl font-bold mb-6">Reset Your Password</h2>
      <p className="text-lg text-white/80 mb-8">
        We will send a verification code to your UTG email so you can reset your
        password and access ITCA resources.
      </p>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <div className="bg-amber-500/20 rounded-full p-3">
            <Mail className="h-6 w-6 text-amber-500" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="font-medium">Check Your UTG Email</h3>
            <p className="text-sm text-white/80">
              After submitting, you will receive a verification code
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="bg-amber-500/20 rounded-full p-3">
            <ArrowRight className="h-6 w-6 text-amber-500" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="font-medium">Enter the Code</h3>
            <p className="text-sm text-white/80">
              Use the code to create a new password
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout
      title="Forgot Password"
      rightSideContent={rightSideContent}
      description="Reset your ITCA account password"
    >
      <>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-600 mb-8">
          Enter your UTG email address and we will send you a code to reset your
          password
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {emailSent ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, y: 70 }}
            className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100"
          >
            <div className="mb-4 flex justify-center">
              <Mail className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Check your UTG email
            </h2>
            <p className="text-gray-600 mb-4">
              We have sent a reset code to:{" "}
              <span className="font-medium">{email}</span>
            </p>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  Please check all folders including spam and junk. The code is
                  valid for 24 hours.
                </p>
              </div>
            </div>
            <Link
              href="/auth/reset-password"
              className="text-blue-700 hover:text-blue-600 font-medium transition-colors"
            >
              <AuthButton>Continue to password reset</AuthButton>
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                UTG Email Address
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

            <AuthButton
              type="submit"
              isLoading={isLoading}
              loadingText="Sending reset code..."
            >
              Send reset code
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

export default ForgotPassword;
