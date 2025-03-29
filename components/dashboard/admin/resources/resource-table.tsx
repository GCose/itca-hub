import { useState } from "react";
import {
  FileText,
  Trash,
  Download,
  File,
  Image as ImageIcon,
  Video,
  BarChart2,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Resource } from "@/hooks/use-resources";
import Link from "next/link";

interface ResourceTableProps {
  resources: Resource[];
  isLoading: boolean;
  onDeleteClick: (resource: Resource) => void;
  onRefresh: () => void;
}

const ResourceTable = ({
  resources,
  isLoading,
  onDeleteClick,
  onRefresh,
}: ResourceTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [fileType, setFileType] = useState("all");
  const [status] = useState("all");

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

  // Filter resources based on search, category, type, and status
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      category === "all" || resource.category === category;
    const matchesType = fileType === "all" || resource.type === fileType;
    const matchesStatus = status === "all" || resource.status === status;

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  // Get unique categories and file types
  const categories = [
    ...new Set(resources.map((resource) => resource.category)),
  ].sort();

  const fileTypes = [
    ...new Set(resources.map((resource) => resource.type)),
  ].sort();

  // Download resource
  const handleDownload = (resource: Resource) => {
    window.open(resource.fileUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="h-6 w-1/4 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Resource",
                  "Category",
                  "Type",
                  "Size",
                  "Uploaded",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse"></div>
                      <div className="ml-4">
                        <div className="h-4 w-36 rounded bg-gray-200 animate-pulse"></div>
                        <div className="mt-1 h-3 w-24 rounded bg-gray-200 animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-4 w-12 rounded bg-gray-200 animate-pulse"></div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-4 w-16 rounded bg-gray-200 animate-pulse"></div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-5 w-16 rounded-full bg-gray-200 animate-pulse"></div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-8 w-20 rounded bg-gray-200 animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (filteredResources.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No resources found
        </h3>
        <p className="text-gray-500 mb-4">
          {resources.length > 0
            ? "Try adjusting your search or filter criteria."
            : "Start by uploading your first resource."}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onRefresh}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>

          <Link
            href="/admin/resources/upload"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Upload New Resource
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="search"
              className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
              placeholder="Search resources by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div>
          <select
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
          >
            <option value="all">All File Types</option>
            {fileTypes.map((type) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-medium text-gray-900">Resources</h3>
          <div className="flex items-center mt-2 sm:mt-0">
            <p className="text-sm text-gray-500">
              Showing {filteredResources.length} of {resources.length} resources
            </p>
            <button
              onClick={onRefresh}
              className="ml-3 p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              title="Refresh resources"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Resource
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Size
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Usage
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredResources.map((resource) => (
                <tr
                  key={resource.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        {getFileIcon(resource.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {resource.title}
                        </div>
                        <div className="text-xs text-gray-500 max-w-xs truncate">
                          {resource.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                      {resource.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <span className="uppercase">{resource.type}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {resource.fileSize}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4 text-gray-400" />
                      <span>{resource.downloads}</span>
                      <span className="text-gray-300">|</span>
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span>{resource.viewCount}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        resource.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {resource.status.charAt(0).toUpperCase() +
                        resource.status.slice(1)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="relative inline-block text-left resource-menu">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(resource)}
                          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-500 transition-colors"
                          title="Download Resource"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            console.log(
                              `View stats for resource ${resource.id}`
                            )
                          }
                          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
                          title="View Statistics"
                        >
                          <BarChart2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onDeleteClick(resource)}
                          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors"
                          title="Delete Resource"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredResources.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled
              >
                Previous
              </button>
              <button
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">
                    {filteredResources.length}
                  </span>{" "}
                  of <span className="font-medium">{resources.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    disabled
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    1
                  </button>
                  <button
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    disabled
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResourceTable;
