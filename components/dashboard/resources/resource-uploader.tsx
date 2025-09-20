import {
  X,
  Plus,
  Video,
  Loader,
  Upload,
  FileText,
  FileType,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData } from '@/types';
import useResourceAdmin from '@/hooks/resources/use-resource-admin';
import {
  Resource,
  UploadProgress,
  ResourceUploaderProps,
  CreateResourcePayload,
} from '@/types/interfaces/resource';

const ResourceUploader = ({ token, onUploadComplete, onError }: ResourceUploaderProps) => {
  const { uploadFile, createResource, isLoading } = useResourceAdmin({ token });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CreateResourcePayload['category']>('lecture_note');
  const [visibility, setVisibility] = useState<CreateResourcePayload['visibility']>('all');
  const [academicLevel, setAcademicLevel] = useState<CreateResourcePayload['academicLevel']>('all');
  const [department, setDepartment] =
    useState<CreateResourcePayload['department']>('computer_science');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    currentFileIndex: 0,
    totalFiles: 0,
    uploadedUrls: [],
    percentage: 0,
    currentFileName: '',
    phase: 'idle',
  });

  const categories: CreateResourcePayload['category'][] = [
    'lecture_note',
    'assignment',
    'past_papers',
    'tutorial',
    'textbook',
    'research_papers',
  ];

  const departments: CreateResourcePayload['department'][] = [
    'computer_science',
    'information_systems',
    'telecommunications',
  ];

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileType className="h-5 w-5 text-gray-500" />;

    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-purple-500" />;
    } else if (fileType.startsWith('video/')) {
      return <Video className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileText className="h-5 w-5 text-green-500" />;
    } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
      return <FileText className="h-5 w-5 text-orange-500" />;
    }

    return <FileType className="h-5 w-5 text-gray-500" />;
  };

  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDepartmentName = (department: string) => {
    return department.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const checkForDuplicates = async (resourceTitle: string): Promise<boolean> => {
    try {
      const response = await axios.get(`${BASE_URL}/resources`, {
        params: {
          page: 0,
          limit: 10,
          search: resourceTitle.trim(),
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'success' && response.data.data.resources) {
        const resources = response.data.data.resources;

        const hasDuplicateTitle = resources.some(
          (resource: Resource) => resource.title.toLowerCase() === resourceTitle.toLowerCase()
        );

        return hasDuplicateTitle;
      }

      return false;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return false;
    }
  };

  const getButtonContent = () => {
    switch (uploadProgress.phase) {
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
            <Upload className="mr-2 h-4 w-4" />
            Uploading {uploadProgress.currentFileIndex + 1}/{uploadProgress.totalFiles} files...
          </>
        );
      case 'creating':
        return (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Creating Resource...
          </>
        );
      case 'failed':
        return (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Resume Upload
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

  const isUploading =
    (uploadProgress.phase !== 'idle' && uploadProgress.phase !== 'failed') || isLoading;

  const handleBatchUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error('Please fill all required fields and select at least one file');
      return;
    }

    try {
      /**=======================================
       * Step 1: Validate for duplicates
       =======================================*/
      setUploadProgress((prev) => ({ ...prev, phase: 'validating' }));

      const isDuplicate = await checkForDuplicates(title);
      if (isDuplicate) {
        toast.error('Duplicate resource', {
          description:
            'A resource with the same title already exists. Please choose a different title.',
        });
        setUploadProgress((prev) => ({ ...prev, phase: 'idle' }));
        return;
      }

      /**=======================================
       * Step 2: Sequential File Upload (LIFO)
       =======================================*/
      const totalFiles = selectedFiles.length;
      const startFromIndex = uploadProgress.uploadedUrls.length;

      setUploadProgress((prev) => ({
        ...prev,
        phase: 'uploading',
        totalFiles,
        currentFileIndex: startFromIndex,
        percentage: startFromIndex > 0 ? Math.round((startFromIndex / totalFiles) * 100) : 0,
      }));

      const uploadedUrls: string[] = [...uploadProgress.uploadedUrls];

      for (let i = startFromIndex; i < totalFiles; i++) {
        const reverseIndex = totalFiles - 1 - i;
        const file = selectedFiles[reverseIndex];

        setUploadProgress((prev) => ({
          ...prev,
          currentFileIndex: i,
          currentFileName: file.name,
          percentage: Math.round((i / totalFiles) * 100),
        }));

        try {
          const fileUrl = await uploadFile(file);
          uploadedUrls.push(fileUrl);

          setUploadProgress((prev) => ({
            ...prev,
            uploadedUrls: [...uploadedUrls],
          }));
        } catch (error) {
          const { message } = getErrorMessage(
            error as AxiosError<ErrorResponseData> | CustomError | Error
          );
          toast.error(`Failed to upload ${file.name}`, {
            description: message,
          });
          setUploadProgress((prev) => ({ ...prev, phase: 'failed' }));
          return;
        }
      }

      /**==========================
       * Step 3: Create Resource
       ==========================*/
      setUploadProgress((prev) => ({
        ...prev,
        phase: 'creating',
        percentage: 100,
        currentFileName: '',
      }));

      const resourcePayload: CreateResourcePayload = {
        title: title.trim(),
        description: description.trim(),
        category,
        fileUrls: uploadedUrls,
        visibility,
        academicLevel,
        department,
      };

      await createResource(resourcePayload);

      toast.success('Resource created successfully', {
        description: `${selectedFiles.length} files uploaded successfully`,
      });

      resetForm();

      if (onUploadComplete) {
        onUploadComplete({
          fileName: `${selectedFiles.length} files`,
          fileUrl: uploadedUrls[0],
          fileType: 'multiple',
          fileSize: formatFileSize(selectedFiles.reduce((total, file) => total + file.size, 0)),
        });
      }
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error
      );
      toast.error('Upload failed', {
        description: message,
      });

      if (onError) {
        onError(message);
      }

      setUploadProgress((prev) => ({ ...prev, phase: 'failed' }));
    }
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setTitle('');
    setDescription('');
    setCategory('lecture_note');
    setVisibility('all');
    setAcademicLevel('all');
    setDepartment('computer_science');

    setUploadProgress({
      currentFileIndex: 0,
      totalFiles: 0,
      uploadedUrls: [],
      percentage: 0,
      currentFileName: '',
      phase: 'idle',
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);
    const totalFiles = selectedFiles.length + newFiles.length;

    const oversizedFiles = newFiles.filter((file) => file.size > 100 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('File too large', {
        description: 'Maximum file size is 100MB per file.',
      });
      return;
    }

    if (totalFiles > 20) {
      const remainingSlots = 20 - selectedFiles.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);
      setSelectedFiles((prev) => [...prev, ...filesToAdd]);

      if (remainingSlots < newFiles.length) {
        toast.warning(`Only ${remainingSlots} files added`, {
          description: 'Maximum 20 files allowed per resource',
        });
      }
    } else {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }

    if (!title && newFiles.length > 0) {
      const fileName = newFiles[0].name;
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
      const cleanedName = nameWithoutExt.replace(/[-_]/g, ' ');

      const formattedTitle = cleanedName
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      setTitle(formattedTitle);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

    if (uploadProgress.phase !== 'idle') {
      setUploadProgress((prev) => ({
        ...prev,
        phase: 'idle',
        uploadedUrls: [],
        percentage: 0,
        currentFileName: '',
        currentFileIndex: 0,
      }));
    }
  };

  const addMoreFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleBatchUpload} className="space-y-6">
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
                  onChange={(e) => setCategory(e.target.value as CreateResourcePayload['category'])}
                  className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none"
                >
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
                  onChange={(e) =>
                    setDepartment(e.target.value as CreateResourcePayload['department'])
                  }
                  className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {formatDepartmentName(dept)}
                    </option>
                  ))}
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
                  onChange={(e) =>
                    setVisibility(e.target.value as CreateResourcePayload['visibility'])
                  }
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
                  value={academicLevel}
                  onChange={(e) =>
                    setAcademicLevel(e.target.value as CreateResourcePayload['academicLevel'])
                  }
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
                <p className="text-sm text-gray-500">Up to 20 files, 100MB per file</p>
              </div>
              <input
                type="file"
                id="file-upload"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
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
                    disabled={isUploading}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add More
                  </button>
                )}
              </div>

              <div className="max-h-50 overflow-y-auto space-y-2">
                {selectedFiles
                  .slice()
                  .reverse()
                  .map((file, reverseIndex) => {
                    const actualIndex = selectedFiles.length - 1 - reverseIndex;
                    const reverseFileIndex = selectedFiles.length - 1 - actualIndex;
                    const isUploaded = uploadProgress.uploadedUrls.length > reverseFileIndex;
                    const isCurrentlyUploading =
                      uploadProgress.phase === 'uploading' &&
                      uploadProgress.currentFileIndex === reverseFileIndex;

                    return (
                      <div
                        key={`${file.name}-${file.size}-${actualIndex}`}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          isUploaded
                            ? 'bg-green-50 border-green-200'
                            : isCurrentlyUploading
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-amber-100/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {isUploaded ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : isCurrentlyUploading ? (
                            <Loader className="h-5 w-5 text-blue-500 animate-spin" />
                          ) : (
                            getFileIcon(file.type)
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        {!isUploading && (
                          <button
                            type="button"
                            onClick={() => removeFile(actualIndex)}
                            className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
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
              <p className="text-sm text-gray-400">Select files to create your resource</p>
            </div>
          )}
        </div>
        {/*==================== End of Right Column: File Upload ====================*/}
      </div>

      {/*==================== Upload Progress Bar ====================*/}
      {uploadProgress.phase !== 'idle' && (
        <div className="rounded-lg bg-white/50 p-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-medium text-gray-700">
              {uploadProgress.phase === 'validating' && 'Validating resource...'}
              {uploadProgress.phase === 'uploading' &&
                `Uploading files: ${uploadProgress.currentFileIndex + 1}/${uploadProgress.totalFiles}`}
              {uploadProgress.phase === 'creating' && 'Creating resource...'}
              {uploadProgress.phase === 'failed' && 'Upload paused - ready to resume'}
            </span>
            <span className="text-gray-500">{uploadProgress.percentage}%</span>
          </div>

          {uploadProgress.currentFileName && (
            <p className="text-sm text-gray-500 mb-2">Current: {uploadProgress.currentFileName}</p>
          )}

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ease-out ${
                uploadProgress.phase === 'failed' ? 'bg-yellow-500' : 'bg-blue-600'
              }`}
              style={{ width: `${uploadProgress.percentage}%` }}
            />
          </div>
        </div>
      )}
      {/*==================== End of Upload Progress Bar ====================*/}

      {/*==================== Submit Button ====================*/}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isFormValid || isUploading}
          className={`inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium text-white transition-all duration-300 shadow-md hover:shadow-lg ${
            isFormValid && !isUploading
              ? uploadProgress.phase === 'failed'
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600'
                : 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700'
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
