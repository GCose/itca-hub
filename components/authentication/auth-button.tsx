import React from "react";

interface AuthButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const AuthButton = ({
  onClick,
  children,
  className = "",
  type = "button",
  disabled = false,
  fullWidth = true,
  isLoading = false,
  variant = "primary",
  loadingText = "Loading...",
}: AuthButtonProps) => {
  // Primary button (blue with amber slide-in effect)
  if (variant === "primary") {
    return (
      <button
        type={type}
        disabled={disabled || isLoading}
        onClick={onClick}
        className={`group relative ${
          fullWidth ? "w-full" : ""
        } py-3 px-4 border-0 rounded-lg text-white bg-blue-700 hover:bg-blue-700 focus:outline-none transition-colors cursor-pointer disabled:opacity-70 overflow-hidden ${className}`}
      >
        {/* Amber overlay that slides in */}
        <span className="absolute inset-0 bg-amber-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-lg"></span>

        {/* Button text */}
        <span className="relative flex justify-center items-center z-10">
          {isLoading ? loadingText : children}
        </span>
      </button>
    );
  }

  // Secondary button (gray/white)
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${
        fullWidth ? "w-full" : ""
      } py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors cursor-pointer disabled:opacity-70 ${className}`}
    >
      <span className="flex justify-center items-center">
        {isLoading ? loadingText : children}
      </span>
    </button>
  );
};

export default AuthButton;
