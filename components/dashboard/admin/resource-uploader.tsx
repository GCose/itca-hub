import { useState, useRef, FormEvent, ChangeEvent } from "react";
import {
  Upload,
  File,
  Check,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Video,
  FileType,
  Loader,
} from "lucide-react";

interface ResourceUploaderProps {
  onUploadComplete?: (fileData: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
  }) => void;
  onError?: (error: string) => void;
}

const ResourceUploader = ({
  onUploadComplete,
  onError,
}: ResourceUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file size (max 100MB as per Jeetix API)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError("File size exceeds 100MB limit");
        return;
      }

      setFile(selectedFile);

      // Auto-fill title from filename if empty
      if (!title) {
        setTitle(selectedFile.name.split(".").slice(0, -1).join("."));
      }

      setError("");
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title for this resource");
      return;
    }

    if (!category) {
      setError("Please select a category");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Use folder based on category if provided
      if (category) {
        formData.append("folder", category.toLowerCase());
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);

      // Upload file to Jeetix File Service API
      const response = await fetch(
        "https://jeetix-file-service.onrender.com/api/storage/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload file");
      }

      const data = await response.json();

      // Set progress to 100% on success
      setUploadProgress(100);
      setSuccess(true);

      // Format file size
      const fileSize = formatFileSize(file.size);

      // Return file data to parent component
      if (onUploadComplete) {
        onUploadComplete({
          fileName: data.data.fileName,
          fileUrl: data.data.fileUrl,
          fileType: file.type,
          fileSize: fileSize,
        });
      }

      // Reset form after successful upload
      setTimeout(() => {
        setFile(null);
        setTitle("");
        setDescription("");
        setUploadProgress(0);
        setSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      setUploadProgress(0);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Function to get file icon based on mime type
  const getFileIcon = () => {
    if (!file) return <Upload className="h-6 w-6 text-gray-400" />;

    const type = file.type;

    if (type.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-purple-500" />;
    } else if (type.startsWith("video/")) {
      return <Video className="h-6 w-6 text-blue-500" />;
    } else if (type.includes("pdf")) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (type.includes("word") || type.includes("document")) {
      return <FileText className="h-6 w-6 text-blue-500" />;
    } else if (type.includes("spreadsheet") || type.includes("excel")) {
      return <FileText className="h-6 w-6 text-green-500" />;
    } else if (type.includes("presentation") || type.includes("powerpoint")) {
      return <FileText className="h-6 w-6 text-orange-500" />;
    }

    return <FileType className="h-6 w-6 text-gray-500" />;
  };

  // Available categories
  const categories = [
    "Programming",
    "Web Development",
    "Database",
    "Machine Learning",
    "Mobile Development",
    "Cybersecurity",
    "Networking",
    "Software Engineering",
    "Computer Science",
    "Data Science",
    "Other",
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Upload New Resource
      </h3>

      {error && (
        <div className="mb-4 flex items-start rounded-lg bg-red-50 p-4 text-red-800">
          <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-start rounded-lg bg-green-50 p-4 text-green-800">
          <Check className="mr-3 h-5 w-5 flex-shrink-0" />
          <p>File uploaded successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              file
                ? "border-blue-300 bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {getFileIcon()}

              {file ? (
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              ) : (
                <>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-medium">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    All file types supported (Max: 100MB)
                  </p>
                </>
              )}
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter resource title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter resource description"
            rows={3}
          />
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">
                Uploading...
              </span>
              <span className="text-xs font-medium text-gray-700">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setTitle("");
              setDescription("");
              setCategory("");
              setError("");
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            disabled={isUploading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isUploading || !file}
          >
            {isUploading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Resource
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceUploader;
