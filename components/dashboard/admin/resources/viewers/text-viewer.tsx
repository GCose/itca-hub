import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";

interface TextViewerProps {
  fileUrl: string;
  title: string;
  resourceId?: string;
}

const TextViewer: React.FC<TextViewerProps> = ({ fileUrl }) => {
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTextContent = async () => {
      try {
        // Fetch as blob to avoid CORS issues
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch text content: ${response.statusText}`
          );
        }

        // Get blob and read as text
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onload = (e) => {
          setText((e.target?.result as string) || "");
          setIsLoading(false);
        };

        reader.onerror = () => {
          setError("Failed to read text content");
          setIsLoading(false);
        };

        reader.readAsText(blob);
      } catch (err) {
        console.error("Error fetching text content:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load text content"
        );
        setIsLoading(false);
      }
    };

    fetchTextContent();
  }, [fileUrl]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 bg-gray-50 rounded-b-lg overflow-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-red-500">
            <p>Error loading text content:</p>
            <p>{error}</p>
            <a
              href={fileUrl}
              download
              className="mt-4 inline-flex items-center text-blue-500 hover:underline"
            >
              <Download className="h-4 w-4 mr-1" />
              Download file instead
            </a>
          </div>
        )}

        {!isLoading && !error && (
          <pre className="p-4 whitespace-pre-wrap font-mono text-sm">
            {text}
          </pre>
        )}
      </div>
    </div>
  );
};

export default TextViewer;
