import { useState, useRef, FormEvent } from 'react';
import { toast } from 'sonner';

interface ResourceUploadHookProps {
  onUploadComplete?: (fileData: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
  }) => void;
  onError?: (error: string) => void;
}

// Define a proper interface for resource metadata
interface ResourceMetadata {
  fileName: string;
  fileUrl: string;
  title: string;
  description: string;
  category: string;
  visibility: 'all' | 'admin';
  featuredOnLanding?: boolean;
  academicLevel?: 'undergraduate' | 'postgraduate' | 'all';
  department?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

const useResourceUploader = ({ onUploadComplete, onError }: ResourceUploadHookProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Basic fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  // Additional fields
  const [visibility, setVisibility] = useState<'all' | 'admin'>('all');
  const [featuredOnLanding, setFeaturedOnLanding] = useState(false);
  const [academicLevel, setAcademicLevel] = useState<'undergraduate' | 'postgraduate' | 'all'>(
    'all'
  );
  const [department, setDepartment] = useState('');

  // Available categories
  const categories = [
    'Lecture Notes',
    'Assignments',
    'Past Papers',
    'Tutorials',
    'Textbooks',
    'Research Papers',
  ];

  // Function to check if a file with similar title already exists
  // This should ideally be a backend call but I will be using the local storage for now
  const checkForDuplicates = async (fileName: string, fileTitle: string): Promise<boolean> => {
    setIsCheckingDuplicate(true);

    try {
      // TEMPORARY IMPLEMENTATION (localStorage)
      // Get existing metadata from localStorage
      const storedMetadata = localStorage.getItem('resourceMetadata');
      if (!storedMetadata) return false;

      const metadataMap: Record<string, ResourceMetadata> = JSON.parse(storedMetadata);

      // Check for duplicate file names (case insensitive)
      const hasDuplicateFileName = Object.keys(metadataMap).some(
        (key) => key.toLowerCase() === fileName.toLowerCase()
      );

      // Check for duplicate titles (case insensitive)
      const hasDuplicateTitle = Object.values(metadataMap).some(
        (metadata: ResourceMetadata) =>
          metadata.title && metadata.title.toLowerCase() === fileTitle.toLowerCase()
      );

      return hasDuplicateFileName || hasDuplicateTitle;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      // Default to false on error to not block upload
      // In production, I might have to handle this differently
      return false;
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  // Function to format file size
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const base = 1024;
    const digitGroups = Math.floor(Math.log(sizeInBytes) / Math.log(base));

    return (
      parseFloat((sizeInBytes / Math.pow(base, digitGroups)).toFixed(2)) + ' ' + units[digitGroups]
    );
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const selectedFile = e.target.files[0];

    // Check file size (100MB limit)
    if (selectedFile.size > 100 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Maximum file size is 100MB.',
      });
      return;
    }

    setFile(selectedFile);

    // Generate a title from the filename if empty
    if (!title) {
      const fileName = selectedFile.name;
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
      const cleanedName = nameWithoutExt.replace(/[-_]/g, ' ');

      // Capitalize first letter of each word
      const formattedTitle = cleanedName
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      setTitle(formattedTitle);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('No file selected', {
        description: 'Please select a file to upload.',
      });
      return;
    }

    if (!title.trim()) {
      toast.error('Title required', {
        description: 'Please provide a title for the resource.',
      });
      return;
    }

    if (!description.trim()) {
      toast.error('Description required', {
        description: 'Please provide a description for the resource.',
      });
      return;
    }

    if (!category) {
      toast.error('Category required', {
        description: 'Please select a category for the resource.',
      });
      return;
    }

    if (!department) {
      toast.error('Department required', {
        description: 'Please select a department for the resource.',
      });
      return;
    }

    // Calculate potential folder path for the file
    const folderName = category.toLowerCase().replace(/\s+/g, '-');
    const potentialFileName = `${folderName}/${file.name}`;

    // First check for duplicates before starting the upload
    const isDuplicate = await checkForDuplicates(potentialFileName, title);
    if (isDuplicate) {
      toast.error('Duplicate resource', {
        description:
          'A resource with the same name or title already exists. Please rename your file or choose a different title.',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for the file upload
      const formData = new FormData();
      formData.append('file', file);

      // Add the category as a folder parameter with itca prefix
      if (category) {
        const folderName = `itca/${category.toLowerCase().replace(/\s+/g, '-')}`;
        formData.append('folder', folderName);
      } else {
        formData.append('folder', 'itca');
      }

      // Upload the file to Jeetix API
      const uploadResponse = await fetch(
        'https://jeetix-file-service.onrender.com/api/storage/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const uploadData = await uploadResponse.json();

      if (uploadData.status !== 'success') {
        throw new Error(uploadData.message || 'File upload failed');
      }

      // Store the metadata
      const metadataPayload: ResourceMetadata = {
        fileName: uploadData.data.fileName,
        fileUrl: uploadData.data.fileUrl,
        title: title,
        description: description,
        category: category,
        visibility: visibility,
        featuredOnLanding: featuredOnLanding,
        academicLevel: academicLevel,
        department: department,
      };

      // TEMPORARY IMPLEMENTATION (localStorage)
      // Store in localStorage for now until the backend API is available
      const existingMetadata = localStorage.getItem('resourceMetadata');
      const metadataMap: Record<string, ResourceMetadata> = existingMetadata
        ? JSON.parse(existingMetadata)
        : {};
      metadataMap[uploadData.data.fileName] = metadataPayload;
      localStorage.setItem('resourceMetadata', JSON.stringify(metadataMap));

      // Call the onUploadComplete callback with the file data
      if (onUploadComplete) {
        onUploadComplete({
          fileName: uploadData.data.fileName,
          fileUrl: uploadData.data.fileUrl,
          fileType: file.type,
          fileSize: formatFileSize(file.size),
        });
      }

      // Reset the form
      resetForm();

      // Show success toast
      toast.success('Resource uploaded successfully!', {
        description: 'Your file has been uploaded and is now available in the resource library.',
      });
    } catch (err) {
      console.error('Error uploading resource:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';

      toast.error('Upload failed', {
        description: errorMessage,
      });

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setVisibility('all');
    setFeaturedOnLanding(false);
    setAcademicLevel('all');
    setDepartment('');

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    file,
    title,
    description,
    category,
    isUploading,
    isCheckingDuplicate,
    fileInputRef,
    categories,
    handleFileChange,
    handleSubmit,
    setTitle,
    setDescription,
    setCategory,
    resetForm,
    formatFileSize,
    visibility,
    setVisibility,
    featuredOnLanding,
    setFeaturedOnLanding,
    academicLevel,
    setAcademicLevel,
    department,
    setDepartment,
  };
};

export default useResourceUploader;
