import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { toast } from "sonner";

interface FileData {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
}

interface UseResourceUploadProps {
  onUploadComplete?: (fileData: FileData) => void;
  onError?: (error: string) => void;
}

export const useResourceUpload = ({
  onUploadComplete,
  onError,
}: UseResourceUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Function to handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file size (max 100MB as per Jeetix API)
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast.error("File size exceeds 100MB limit");
        return;
      }

      setFile(selectedFile);

      // Auto-fill title from filename if empty
      if (!title) {
        setTitle(selectedFile.name.split(".").slice(0, -1).join("."));
      }
    }
  };

  // Reset the form
  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setCategory("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title for this resource");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    setIsUploading(true);

    // Loading toast that will be updated
    const toastId = toast.loading(`Uploading ${file.name}...`);

    try {
      // FormData object for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Folder based on category if provided
      if (category) {
        formData.append("folder", category.toLowerCase());
      }

      // Upload file to Jeetix File Service API
      const response = await fetch(
        "https://jeetix-file-service.onrender.com/api/storage/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload file");
      }

      const data = await response.json();

      // Update toast to success
      toast.success("Resource uploaded successfully", {
        id: toastId,
        description: file.name,
      });

      // Format file size
      const fileSize = formatFileSize(file.size);

      // Process response
      const fileData: FileData = {
        fileName: data.data.fileName,
        fileUrl: data.data.fileUrl,
        fileType: file.type,
        fileSize: fileSize,
      };

      // Return file data to parent component
      if (onUploadComplete) {
        onUploadComplete(fileData);
      }

      // Reset form after successful upload
      setTimeout(resetForm, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      // Update toast to error
      toast.error("Upload failed", {
        id: toastId,
        description: errorMessage,
      });

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
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

  return {
    file,
    title,
    description,
    category,
    isUploading,
    fileInputRef,
    categories,
    handleFileChange,
    handleSubmit,
    setTitle,
    setDescription,
    setCategory,
    resetForm,
    formatFileSize,
  };
};
