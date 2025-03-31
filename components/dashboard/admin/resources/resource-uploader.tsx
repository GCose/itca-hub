import useResourceUploader from "@/hooks/admin/use-resource-uploader";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  FileType,
  Loader,
} from "lucide-react";

// Define proper types
type Visibility = "students" | "admin";

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
  const {
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
    formatFileSize,
    visibility,
    setVisibility,
    department,
    setDepartment,
  } = useResourceUploader({ onUploadComplete, onError });

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

  // Check if form is valid
  const isFormValid =
    file && title.trim() && description.trim() && category && department;

  return (
    <div className="rounded-2xl bg-white p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Upload New Resource
      </h3>

      <form onSubmit={handleSubmit}>
        {/*==================== File Upload Section ====================*/}
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
                <div className="mt-2 text-center w-full px-4">
                  <p className="text-sm font-medium text-gray-900 truncate">
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
              type="file"
              id="file-upload"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </label>
        </div>
        {/*==================== End of File Upload Section ====================*/}

        {/*==================== Title and Category Section ====================*/}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              id="title"
              type="text"
              value={title}
              placeholder="Enter resource title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
              required
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
        {/*==================== End of Title and Category Section ====================*/}

        {/*==================== Description Section ====================*/}
        <div className="mt-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            id="description"
            value={description}
            placeholder="Enter resource description"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        {/*==================== End of Description Section ====================*/}

        {/*==================== Visibility and Department Section ====================*/}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
          <div>
            <label
              htmlFor="visibility"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Visibility <span className="text-red-500">*</span>
            </label>
            <select
              required
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as Visibility)}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="students">For Students</option>
              <option value="admin">For Administrators</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department <span className="text-red-500">*</span>
            </label>
            <select
              required
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              <option value="computer-science">Computer Science</option>
              <option value="information-systems">Information Systems</option>
              <option value="telecommunications">Telecommunications</option>
            </select>
          </div>
        </div>
        {/*==================== End of Visibility and Department Section ====================*/}

        {/*==================== Submit Button ====================*/}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="submit"
            disabled={isUploading || !isFormValid}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
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
        {/*==================== End of Submit Button ====================*/}
      </form>
    </div>
  );
};

export default ResourceUploader;
