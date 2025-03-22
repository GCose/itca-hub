import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const StepIndicator = ({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index <= currentStep - 1
                  ? "bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>

            {/* Progress bar between steps */}
            {index < totalSteps - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  index < currentStep - 1 ? "bg-blue-700" : "bg-gray-300"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {labels.map((label, index) => (
          <span key={index} className="text-xs font-medium text-gray-600">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
