import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import AuthLayout from "@/components/ui/layouts/auth-layout";
import AuthButton from "@/components/ui/auth-button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setIsLoading(true);
      // API call would go here - Ebrima Mbye
      // Example: await api.forgotPassword({ email });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      setEmailSent(true);
      toast.success("Password reset link sent to your email", {
        description: "Please check your inbox and follow the instructions",
        duration: 5000,
      });
    } catch (err) {
      setError("An error occurred. Please try again.");
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
      <h2 className="text-5xl font-bold mb-6">Reset Your Password</h2>
      <p className="text-lg text-white/80 mb-8">
        We will send you instructions on how to reset your password so you can
        get back to accessing all the ITCA resources.
      </p>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <div className="bg-amber-500/20 rounded-full p-3">
            <Mail className="h-6 w-6 text-amber-500" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="font-medium">Check Your Email</h3>
            <p className="text-sm text-white/80">
              After submitting, you will receive a password reset link
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="bg-amber-500/20 rounded-full p-3">
            <ArrowRight className="h-6 w-6 text-amber-500" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="font-medium">Follow the Link</h3>
            <p className="text-sm text-white/80">
              Click the link in your email to create a new password
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
          Enter your email address and we will send you a link to reset your
          password
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {emailSent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100"
          >
            <div className="mb-4 flex justify-center">
              <Mail className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Check your email
            </h2>
            <p className="text-gray-600 mb-6">
              We have sent a password reset link to {email}
            </p>
            <Link
              href="/auth"
              className="text-blue-700 hover:text-blue-600 font-medium transition-colors"
            >
              Return to sign in
            </Link>
          </motion.div>
        ) : (
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

            <AuthButton
              type="submit"
              isLoading={isLoading}
              loadingText="Sending reset link..."
            >
              Send reset link
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
