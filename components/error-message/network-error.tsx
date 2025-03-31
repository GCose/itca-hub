import React from "react";
import { WifiOff, RefreshCw } from "lucide-react";

interface NetworkErrorProps {
  title?: string;
  description?: string;
  onRetry: () => void;
  retryButtonText?: string;
}

const NetworkError: React.FC<NetworkErrorProps> = ({
  title = "Unable to fetch resources",
  description = "Please check your internet connection and try again.",
  onRetry,
  retryButtonText = "Refresh",
}) => {
  return (
    <div className="rounded-2xl bg-white p-8 text-center">
      <WifiOff className="mx-auto h-12 w-12 text-red-400 mb-3" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <div className="flex justify-center">
        <button
          onClick={onRetry}
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {retryButtonText}
        </button>
      </div>
    </div>
  );
};

export default NetworkError;
