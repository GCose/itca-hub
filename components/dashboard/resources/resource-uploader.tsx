import {
  X,
  Plus,
  Video,
  Loader,
  Upload,
  FileText,
  FileType,
  Image as ImageIcon,
} from 'lucide-react';
import { useState } from 'react';
import { ResourceUploaderProps } from '@/types/interfaces/resource';
import useResourceUploader from '@/hooks/admin/resources/use-resource-uploader';

const ResourceUploader = ({ token, onUploadComplete, onError }: ResourceUploaderProps) => {
  const {
    title,
    category,
    setTitle,
    visibility,
    department,
    categories,
    description,
    isUploading,
    uploadState,
    setCategory,
    fileInputRef,
    handleSubmit,
    setDepartment,
    setVisibility,
    setDescription,
    formatFileSize,
    handleFileChange,
  } = useResourceUploader({ token, onUploadComplete, onError });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileType className="h-5 w-5 text-gray-500" />;

    const type = fileType;

    if (type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-purple-500" />;
    } else if (type.startsWith('video/')) {
      return <Video className="h-5 w-5 text-blue-500" />;
    } else if (type.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (type.includes('word') || type.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (type.includes('spreadsheet') || type.includes('excel')) {
      return <FileText className="h-5 w-5 text-green-500" />;
    } else if (type.includes('presentation') || type.includes('powerpoint')) {
      return <FileText className="h-5 w-5 text-orange-500" />;
    }

    return <FileType className="h-5 w-5 text-gray-500" />;
  };

  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getButtonContent = () => {
    switch (uploadState) {
      case 'validating':
        return (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Validating...
          </>
        );
      case 'uploading':
        return (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Uploading Files...
          </>
        );
      case 'creating':
        return (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Creating Resource...
          </>
        );
      default:
        return (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Create Resource
          </>
        );
    }
  };

  const isFormValid =
    selectedFiles.length > 0 && title.trim() && description.trim() && category && department;

  const handleFileChangeWithState = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);
    const totalFiles = selectedFiles.length + newFiles.length;

    // Respect 20 file limit
    if (totalFiles > 20) {
      const remainingSlots = 20 - selectedFiles.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);
      setSelectedFiles((prev) => [...prev, ...filesToAdd]);
    } else {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    handleFileChange(e);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addMoreFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/*==================== Left Column: Resource Information ====================*/}
        <div className="rounded-2xl bg-white/50 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            Resource Information
          </h3>

          <div className="space-y-4">
            {/*==================== Title Field ====================*/}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                required
                id="title"
                type="text"
                value={title}
                placeholder="Enter resource title"
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none"
              />
            </div>
            {/*==================== End of Title Field ====================*/}

            {/*==================== Description Field ====================*/}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                id="description"
                value={description}
                placeholder="Describe what this resource contains..."
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none resize-none"
              />
            </div>
            {/*==================== End of Description Field ====================*/}

            {/*==================== Category and Department Row ====================*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {formatCategoryName(cat)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none"
                >
                  <option value="">Select department</option>
                  <option value="computer_science">Computer Science</option>
                  <option value="information_systems">Information Systems</option>
                  <option value="telecommunications">Telecommunications</option>
                </select>
              </div>
            </div>
            {/*==================== End of Category and Department Row ====================*/}

            {/*==================== Visibility and Academic Level Row ====================*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="visibility"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Visibility
                </label>
                <select
                  id="visibility"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as 'all' | 'admin')}
                  className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none"
                >
                  <option value="all">All Users</option>
                  <option value="admin">Admin Only</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="academic-level"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Academic Level
                </label>
                <select
                  id="academic-level"
                  value="all"
                  className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>
            {/*==================== End of Visibility and Academic Level Row ====================*/}
          </div>
        </div>
        {/*==================== End of Left Column: Resource Information ====================*/}

        {/*==================== Right Column: File Upload ====================*/}
        <div className="rounded-2xl bg-white/50 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <Upload className="h-5 w-5 text-green-600 mr-2" />
            Upload Files
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({selectedFiles.length}/20)
            </span>
          </h3>

          {/*==================== File Upload Area ====================*/}
          <div className="mb-6">
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                selectedFiles.length > 0
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="mb-1 text-sm text-gray-500">
                  <span className="font-medium">Click to select files</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">Up to 20 files, 100MB per file</p>
              </div>
              <input
                type="file"
                id="file-upload"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChangeWithState}
              />
            </label>
          </div>

          {/*==================== Selected Files List ====================*/}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Selected Files</h4>
                {selectedFiles.length < 20 && (
                  <button
                    type="button"
                    onClick={addMoreFiles}
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add More
                  </button>
                )}
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2">
                {selectedFiles
                  .slice()
                  .reverse()
                  .map((file, reverseIndex) => {
                    const actualIndex = selectedFiles.length - 1 - reverseIndex;
                    return (
                      <div
                        key={`${file.name}-${file.size}-${actualIndex}`}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(actualIndex)}
                          className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/*==================== File Upload Status ====================*/}
          {selectedFiles.length === 0 && (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No files selected</p>
              <p className="text-xs text-gray-400">Select files to create your resource</p>
            </div>
          )}
        </div>
        {/*==================== End of Right Column: File Upload ====================*/}
      </div>

      {/*==================== Submit Button ====================*/}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isFormValid || isUploading}
          className={`inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium text-white transition-all duration-300 shadow-md hover:shadow-lg ${
            isFormValid && !isUploading
              ? 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {getButtonContent()}
        </button>
      </div>
      {/*==================== End of Submit Button ====================*/}
    </form>
  );
};

export default ResourceUploader;
