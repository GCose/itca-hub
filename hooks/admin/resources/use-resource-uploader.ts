import { useState, useRef, FormEvent } from 'react';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { CreateResourcePayload } from '@/types';

interface ResourceUploadHookProps {
  token: string;
  onUploadComplete?: (fileData: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
  }) => void;
  onError?: (error: string) => void;
}

const useResourceUploader = ({ token, onUploadComplete, onError }: ResourceUploadHookProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState<'all' | 'admin'>('all');
  const [academicLevel, setAcademicLevel] = useState<'undergraduate' | 'postgraduate' | 'all'>(
    'all'
  );
  const [department, setDepartment] = useState('');

  // Available categories
  const categories = [
    'lecture_note',
    'assignment',
    'past_papers',
    'tutorial',
    'textbook',
    'research_papers',
  ];

  /**==================================================================================
   * Checks for duplicate resources based on title.
   * @param resourceTitle The title of the resource to check for duplicates.
   * @returns Promise<boolean> Returns true if a duplicate is found, false otherwise.
   ==================================================================================*/
  const checkForDuplicates = async (resourceTitle: string): Promise<boolean> => {
    setIsCheckingDuplicate(true);

    try {
      // Search for resources with similar title using the API
      const response = await fetch(
        `${BASE_URL}/resources?page=0&limit=10&search=${encodeURIComponent(resourceTitle)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.warn('Could not check for duplicates:', response.statusText);
        // Don't block upload if we can't check for duplicates
        return false;
      }

      const data = await response.json();

      if (data.status === 'success' && data.data.resources) {
        const resources = data.data.resources;

        // Check for exact title match (case insensitive)
        const hasDuplicateTitle = resources.some(
          (resource: { title: string }) =>
            resource.title.toLowerCase() === resourceTitle.toLowerCase()
        );

        return hasDuplicateTitle;
      }

      return false;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      // Default to false on error to not block upload
      return false;
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  /**============================================================
   * Formats a file size in bytes into a human-readable string.
   * @param sizeInBytes Size in bytes to format.
   * @returns Formatted file size string (e.g., "1.23 MB").
   ============================================================*/
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const base = 1024;
    const digitGroups = Math.floor(Math.log(sizeInBytes) / Math.log(base));

    return (
      parseFloat((sizeInBytes / Math.pow(base, digitGroups)).toFixed(2)) + ' ' + units[digitGroups]
    );
  };

  /**==================================================
   * Handles file selection from the file input.
   * @param e  The change event from the file input.
   * @returns void
   ==================================================*/
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

  /**========================================================
   * Handles the form submission for uploading a resource.
   * @param e The form submission event.
   * @returns void
   ========================================================*/
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

    // Check for duplicates before starting the upload
    const isDuplicate = await checkForDuplicates(title);
    if (isDuplicate) {
      toast.error('Duplicate resource', {
        description:
          'A resource with the same title already exists. Please choose a different title.',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Upload the file to Jeetix API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'itca-resources');

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

      // Step 2: Create resource via ITCA API
      const resourcePayload: CreateResourcePayload = {
        title: title.trim(),
        description: description.trim(),
        category: category,
        fileUrls: [uploadData.data.fileUrl],
        visibility: visibility,
        academicLevel: academicLevel,
        department: department,
      };

      const createResponse = await fetch(`${BASE_URL}/resources`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resourcePayload),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create resource');
      }

      const createData = await createResponse.json();

      if (createData.status !== 'success') {
        throw new Error(createData.message || 'Failed to create resource');
      }

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

  /**=================================================
   * Resets the form fields to their initial state.
   =================================================*/
  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setVisibility('all');
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
    academicLevel,
    setAcademicLevel,
    department,
    setDepartment,
  };
};

export default useResourceUploader;
