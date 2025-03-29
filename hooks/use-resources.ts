import { useState, useCallback } from "react";
import { toast } from "sonner";

// Types for the resources and API responses
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  dateUploaded: string;
  fileSize: string;
  downloads: number;
  viewCount: number;
  status: "active" | "archived";
  uploadedBy: string;
  fileUrl: string;
  fileName: string;
}

// Structure of items returned by Jeetix API
interface JeetixFileItem {
  name: string;
  url: string;
  metadata?: {
    id?: string;
    timeCreated?: string;
    size?: string;
    [key: string]: unknown;
  };
}

// Structure of the Jeetix API response
interface JeetixApiResponse {
  status: string;
  data: JeetixFileItem[];
}

export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to format file size
  const formatFileSize = (sizeInBytes: number): string => {
    if (!sizeInBytes) return "Unknown";

    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  // Function to get file type from filename
  const getFileType = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    return ext;
  };

  // Extract a more meaningful title from the filename
  const extractTitle = (fileName: string): string => {
    // Remove file extension and path
    const baseName = fileName.split("/").pop() || fileName;
    const nameWithoutExt = baseName.substring(0, baseName.lastIndexOf("."));

    // Replace dashes and underscores with spaces
    const cleanedName = nameWithoutExt.replace(/[-_]/g, " ");

    // Capitalize first letter of each word
    return cleanedName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Fetch resources from Jeetix API
  const fetchResources = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://jeetix-file-service.onrender.com/api/storage/list"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch resources from server");
      }

      const data = (await response.json()) as JeetixApiResponse;

      if (data.status !== "success" || !Array.isArray(data.data)) {
        throw new Error("Invalid response format from server");
      }

      // Map Jeetix data to our Resource interface
      const mappedResources: Resource[] = data.data.map(
        (item: JeetixFileItem, index: number) => {
          const fileType = getFileType(item.name);
          const pathParts = item.name.split("/");
          const fileName = pathParts[pathParts.length - 1];
          const category =
            pathParts.length > 1 ? pathParts[0] : "Uncategorized";

          // Get a better title
          const title = extractTitle(fileName);

          // Get date from item.metadata.timeCreated or current date
          const uploadDate = item.metadata?.timeCreated
            ? new Date(item.metadata.timeCreated).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

          return {
            id: item.metadata?.id || `resource-${index}`,
            title: title,
            description: `${category} resource`,
            type: fileType,
            category: category.charAt(0).toUpperCase() + category.slice(1),
            dateUploaded: uploadDate,
            fileSize: item.metadata?.size
              ? formatFileSize(parseInt(item.metadata.size))
              : "Unknown",
            downloads: Math.floor(Math.random() * 100), // Placeholder since Jeetix doesn't track this
            viewCount: Math.floor(Math.random() * 150), // Placeholder
            status: "active",
            uploadedBy: "Admin",
            fileUrl: item.url,
            fileName: item.name,
          };
        }
      );

      setResources(mappedResources);
    } catch (err) {
      console.error("Error fetching resources:", err);
      toast.error("Failed to load resources", {
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a resource
  const deleteResource = async (
    resourceFileName: string,
    resourceTitle: string
  ): Promise<boolean> => {
    setIsDeleting(true);

    const toastId = toast.loading(`Deleting ${resourceTitle}...`);

    try {
      const response = await fetch(
        `https://jeetix-file-service.onrender.com/api/storage/delete/${encodeURIComponent(resourceFileName)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete resource");
      }

      toast.success("Resource deleted", {
        id: toastId,
        description: `${resourceTitle} has been successfully deleted.`,
      });

      // Return success
      return true;
    } catch (err) {
      console.error("Error deleting resource:", err);
      toast.error("Failed to delete resource", {
        id: toastId,
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle successful deletion by updating state
  const handleDeleteSuccess = (resourceId: string) => {
    setResources(resources.filter((r) => r.id !== resourceId));
  };

  return {
    resources,
    isLoading,
    isDeleting,
    fetchResources,
    deleteResource,
    handleDeleteSuccess,
  };
};
