import { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Download,
  BookOpen,
  Image as ImageIcon,
  FileType,
  Video,
  ChevronDown,
  ChevronUp,
  Clock,
  Star,
  StarHalf,
} from "lucide-react";
import Link from "next/link";

interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  category: string;
  dateUploaded: string;
  fileSize: string;
  rating: number;
  downloads: number;
}

const ResourceManager = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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
            rating: 4.5,
            downloads: 120,
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
            rating: 4.2,
            downloads: 85,
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
            rating: 4.8,
            downloads: 95,
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
            rating: 4.9,
            downloads: 150,
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
            rating: 4.6,
            downloads: 78,
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
        return <FileType className="h-5 w-5 text-gray-500" />;
    }
  };

  // Filter and sort resources
  const filteredResources = resources
    .filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || resource.category === selectedCategory;
      const matchesType =
        selectedType === "all" || resource.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "date") {
        return sortDirection === "asc"
          ? new Date(a.dateUploaded).getTime() -
              new Date(b.dateUploaded).getTime()
          : new Date(b.dateUploaded).getTime() -
              new Date(a.dateUploaded).getTime();
      } else if (sortBy === "downloads") {
        return sortDirection === "asc"
          ? a.downloads - b.downloads
          : b.downloads - a.downloads;
      } else if (sortBy === "rating") {
        return sortDirection === "asc"
          ? a.rating - b.rating
          : b.rating - a.rating;
      }
      return 0;
    });

  // Function to render star ratings
  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="h-4 w-4 fill-amber-500 text-amber-500"
          />
        ))}
        {hasHalfStar && (
          <StarHalf className="h-4 w-4 fill-amber-500 text-amber-500" />
        )}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Function to handle sorting direction toggle
  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortDirection("desc");
    }
  };

  // Categories and types for filters
  const categories = [
    "Programming",
    "Web Development",
    "Database",
    "Machine Learning",
    "Mobile Development",
  ];
  const types = ["pdf", "pptx", "docx", "mp4"];

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col md:flex-row gap-4 items-stretch md:items-center animate-pulse">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>

        <div className="border-t border-gray-100 pt-5">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="mb-4 border-b border-gray-100 pb-4">
              <div className="flex">
                <div className="mr-4 h-12 w-12 rounded-lg bg-gray-200 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredResources.length === 0 && !isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-auto">
            <select
              className="w-full md:w-32 rounded-lg border border-gray-200 py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-auto">
            <select
              className="w-full md:w-32 rounded-lg border border-gray-200 py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-8 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No resources found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-auto">
          <select
            className="w-full md:w-32 rounded-lg border border-gray-200 py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto">
          <select
            className="w-full md:w-32 rounded-lg border border-gray-200 py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="flex justify-end mb-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Sort by:</span>
            <button
              className={`flex items-center px-2 py-1 rounded ${sortBy === "date" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
              onClick={() => handleSortChange("date")}
            >
              Date
              {sortBy === "date" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                ))}
            </button>
            <button
              className={`flex items-center px-2 py-1 rounded ${sortBy === "title" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
              onClick={() => handleSortChange("title")}
            >
              Title
              {sortBy === "title" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                ))}
            </button>
            <button
              className={`flex items-center px-2 py-1 rounded ${sortBy === "rating" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
              onClick={() => handleSortChange("rating")}
            >
              Rating
              {sortBy === "rating" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                ))}
            </button>
          </div>
        </div>

        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="mb-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex">
              <div className="mr-4 rounded-lg bg-gray-100 p-3">
                {getFileIcon(resource.type)}
              </div>
              <div className="flex-1">
                <Link
                  href={`/student/resources/${resource.id}`}
                  className="block mb-1"
                >
                  <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {resource.description}
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center">
                      <Clock className="mr-1 h-3.5 w-3.5" />
                      {new Date(resource.dateUploaded).toLocaleDateString()}
                    </span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                      {resource.fileSize}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {resource.category}
                    </span>
                    <span className="uppercase bg-gray-100 px-2 py-0.5 rounded">
                      {resource.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    {renderStarRating(resource.rating)}
                    <span className="inline-flex items-center">
                      <Download className="mr-1 h-3.5 w-3.5" />
                      {resource.downloads} downloads
                    </span>
                    <button
                      className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                      onClick={() =>
                        console.log(`Download resource ${resource.id}`)
                      }
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceManager;
