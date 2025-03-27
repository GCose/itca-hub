import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import AuthLayout from "@/components/ui/layouts/auth-layout";

// Import types
import { FormData, RegisterUserDTO } from "@/types/sign-up";

// Import utilities
import {
  validatePersonalInfo,
  validateSecurity,
} from "@/utils/sign-up/validation";
import PersonalInfoStep from "@/components/ui/sign-up/personal-info-steps";
import SecurityStep from "@/components/ui/sign-up/security-step";
import StepIndicator from "@/components/ui/sign-up/step-indicator";

const SignUp = () => {
  // State management
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  // Event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const nextStep = () => {
    const { isValid, error } = validatePersonalInfo(formData);
    if (isValid) {
      setError("");
      setStep(2);
    } else {
      setError(error);
    }
  };

  const prevStep = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, error } = validateSecurity(formData);
    if (!isValid) {
      setError(error);
      return;
    }
    setError("");

    try {
      setIsLoading(true);

      // Changed the FormData to RegisterUserDTO as expected by the backend [Cough cough Jordan]
      const registerData: RegisterUserDTO = {
        schoolEmail: formData.email, // Map email to schoolEmail
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        // The backend will handle defaults for optional fields so no need to place that here, I'm sure you already know that
      };

      // API call would go here - Ebrima Mbye
      // Example: const response = await api.register(registerData);
      console.log("Sending to backend:", registerData);

      // Simulating API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to dashboard or home page after successful registration
      window.location.href = "/";
    } catch (err) {
      setError("An error occurred during registration");
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
      <h2 className="text-5xl font-bold mb-6">Join the ITCA Community</h2>
      <p className="text-lg text-white/80 mb-8">
        Become a member of our growing community of tech enthusiasts and
        professionals. Gain access to exclusive resources, events, and
        networking opportunities.
      </p>

      <div className="space-y-4 max-w-md m-auto">
        {/*==================== Item 1 ====================*/}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center hover:translate-x-3 hover:transition-all hover: duration-300">
          <div className="bg-amber-500/20 rounded-full p-2 mr-4">
            <CheckCircle className="h-6 w-6 text-amber-500" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Access to Resources</h3>
            <p className="text-sm text-white/80">
              Exclusive learning materials and tools
            </p>
          </div>
        </div>
        {/*==================== End of Item 1 ====================*/}

        {/*==================== Item 2 ====================*/}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center hover:translate-x-3 hover:transition-all hover: duration-300">
          <div className="bg-amber-500/20 rounded-full p-2 mr-4">
            <CheckCircle className="h-6 w-6 text-amber-500" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Networking Opportunities</h3>
            <p className="text-sm text-white/80">
              Connect with industry professionals
            </p>
          </div>
        </div>
        {/*==================== End of Item 2 ====================*/}

        {/*==================== Item 3 ====================*/}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center hover:translate-x-3 hover:transition-all hover: duration-300">
          <div className="bg-amber-500/20 rounded-full p-2 mr-4">
            <CheckCircle className="h-6 w-6 text-amber-500" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Event Participation</h3>
            <p className="text-sm text-white/80">
              Priority access to workshops and conferences
            </p>
          </div>
        </div>
        {/*==================== End of Item 3 ====================*/}
      </div>
    </motion.div>
  );

  return (
    <AuthLayout
      title="Sign Up"
      rightSideContent={rightSideContent}
      description="Create your ITCA account"
    >
      <>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create your account
        </h1>
        <p className="text-gray-600 mb-8">
          Join ITCA to access exclusive resources and events
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/*==================== Step indicator component ====================*/}
          <StepIndicator
            totalSteps={2}
            currentStep={step}
            labels={["Personal Info", "Security"]}
          />
          {/*==================== End of Step indicator component ====================*/}

          {/*==================== Render the appropriate step component ====================*/}
          {step === 1 ? (
            <PersonalInfoStep
              formData={formData}
              onContinue={nextStep}
              onChange={handleChange}
            />
          ) : (
            <SecurityStep
              formData={formData}
              onPrevious={prevStep}
              isLoading={isLoading}
              onChange={handleChange}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
              toggleShowConfirmPassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth"
              className="text-blue-700 hover:text-blue-600 font-medium transition-colors hover:cursor-pointer"
            >
              Sign in
            </Link>
          </p>
        </div>
      </>
    </AuthLayout>
  );
};

export default SignUp;
