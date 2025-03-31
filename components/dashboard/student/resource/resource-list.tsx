import {
  FileText,
  File,
  Download,
  BookOpen,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

interface Resource {
  id: number;
  title: string;
  type: string;
  date: string;
}

interface ResourceListProps {
  resources: Resource[];
  isLoading?: boolean;
}

const ResourceList = ({ resources, isLoading = false }: ResourceListProps) => {
  // Function to get the appropriate icon based on file type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon className="h-5 w-5 text-purple-500" />;
      case "mp4":
      case "avi":
      case "mov":
        return <Video className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex items-center border-b border-gray-100 p-3 last:border-b-0"
          >
            <div className="mr-3 h-9 w-9 rounded bg-gray-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse mb-2"></div>
              <div className="h-3 w-1/4 rounded bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No recent resources
        </h3>
        <p className="text-gray-500 mb-4">
          You haven{"'"}t accessed any resources recently.
        </p>
        <Link
          href="/student/resources"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none  focus:ring-blue-500 focus:ring-offset-2"
        >
          Browse resources
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-center p-3 hover:bg-gray-50 transition duration-150"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              {getFileIcon(resource.type)}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <Link href={`/student/resources/${resource.id}`}>
                <p className="truncate text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                  {resource.title}
                </p>
                <p className="text-xs text-gray-500">{resource.date}</p>
              </Link>
            </div>
            <button
              className="ml-2 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
              title="Download resource"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-100">
        <Link
          href="/student/resources"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View all resources
        </Link>
      </div>
    </div>
  );
};

export default ResourceList;
