import { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Edit,
  Trash,
  Download,
  Upload,
  File,
  Image as ImageIcon,
  Video,
  BarChart2,
  Eye,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

interface Resource {
  id: number;
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
}

const AdminResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [fileType, setFileType] = useState("all");
  const [status] = useState("all");
  const [selectedResource, setSelectedResource] = useState<number | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockResources = [
          {
            id: 1,
            title: "Introduction to Python Programming",
            description:
              "A comprehensive guide for beginners to learn Python programming from scratch.",
            type: "pdf",
            category: "Programming",
            dateUploaded: "2023-10-15",
            fileSize: "2.4 MB",
            downloads: 120,
            viewCount: 185,
            status: "active" as const,
            uploadedBy: "Admin",
          },
          {
            id: 2,
            title: "Web Development Fundamentals",
            description:
              "Learn the basics of HTML, CSS, and JavaScript for web development.",
            type: "pptx",
            category: "Web Development",
            dateUploaded: "2023-10-10",
            fileSize: "5.1 MB",
            downloads: 85,
            viewCount: 112,
            status: "active" as const,
            uploadedBy: "Dr. Sarah Johnson",
          },
          {
            id: 3,
            title: "Database Design Principles",
            description:
              "Understand the core concepts of database design and normalization.",
            type: "pdf",
            category: "Database",
            dateUploaded: "2023-09-28",
            fileSize: "3.2 MB",
            downloads: 95,
            viewCount: 142,
            status: "active" as const,
            uploadedBy: "Prof. Michael Chen",
          },
          {
            id: 4,
            title: "Machine Learning Algorithms",
            description:
              "An overview of popular machine learning algorithms and their applications.",
            type: "pdf",
            category: "Machine Learning",
            dateUploaded: "2023-09-15",
            fileSize: "4.7 MB",
            downloads: 150,
            viewCount: 210,
            status: "active" as const,
            uploadedBy: "Dr. Emily Clark",
          },
          {
            id: 5,
            title: "Mobile App Development Tutorial",
            description:
              "Step-by-step guide to developing mobile applications using React Native.",
            type: "mp4",
            category: "Mobile Development",
            dateUploaded: "2023-08-20",
            fileSize: "125 MB",
            downloads: 78,
            viewCount: 96,
            status: "archived" as const,
            uploadedBy: "Dr. David Wilson",
          },
        ];

        setResources(mockResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

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

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedResource &&
        !(event.target as HTMLElement).closest(".resource-menu")
      ) {
        setSelectedResource(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedResource]);

  // Get unique categories and file types
  const categories = [
    ...new Set(resources.map((resource) => resource.category)),
  ];
  const fileTypes = [...new Set(resources.map((resource) => resource.type))];

  const handleUploadResourceClick = () => {
    console.log("Navigate to upload resource form");
    // In a real app, this would redirect to the upload form
  };

  return (
    <DashboardLayout title="Resource Management">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Resource Management
            </h1>
            <p className="text-gray-600">
              Upload and manage educational resources and materials
            </p>
          </div>

          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleUploadResourceClick}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Resource
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search resources by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div>
          <select
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

      {isLoading ? (
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
      ) : filteredResources.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No resources found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={handleUploadResourceClick}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload New Resource
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900">Resources</h3>
            <p className="text-sm text-gray-500 mt-1 sm:mt-0">
              Showing {filteredResources.length} of {resources.length} resources
            </p>
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
                  <tr key={resource.id} className="hover:bg-gray-50">
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
                            onClick={() =>
                              console.log(
                                `View stats for resource ${resource.id}`
                              )
                            }
                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            title="View Statistics"
                          >
                            <BarChart2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              console.log(`Edit resource ${resource.id}`)
                            }
                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            title="Edit Resource"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              console.log(`Delete resource ${resource.id}`)
                            }
                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
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

          <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <a
                href="#"
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </a>
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
                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
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
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
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
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminResourcesPage;
