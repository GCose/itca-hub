import { useState, useRef, FormEvent } from 'react';
import { toast } from 'sonner';
import { ResourceAdapter } from '@/utils/resource-adapter';
import { apiClient } from '@/utils/api';

type UploadState = 'idle' | 'validating' | 'uploading' | 'creating';

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
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState<'all' | 'admin'>('all');
  const [academicLevel, setAcademicLevel] = useState<'undergraduate' | 'postgraduate' | 'all'>(
    'all'
  );
  const [department, setDepartment] = useState('');

  const categories = [
    'lecture_note',
    'assignment',
    'past_papers',
    'tutorial',
    'textbook',
    'research_papers',
  ];

  const isUploading = uploadState !== 'idle';

  /**===============================================
   * Checks for duplicate resources based on title
   ===============================================*/
  const checkForDuplicates = async (resourceTitle: string): Promise<boolean> => {
    try {
      const response = await apiClient.getResources(
        { page: 0, limit: 10, search: resourceTitle },
        token
      );

      if (response.status === 'success' && response.data.resources) {
        const resources = response.data.resources;

        const hasDuplicateTitle = resources.some(
          (resource) => resource.title.toLowerCase() === resourceTitle.toLowerCase()
        );

        return hasDuplicateTitle;
      }

      return false;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return false;
    }
  };

  /**==================================================
   * Handles file selection from the file input
   ==================================================*/
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const selectedFile = e.target.files[0];

    if (selectedFile.size > 100 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Maximum file size is 100MB.',
      });
      return;
    }

    setFile(selectedFile);

    if (!title) {
      const fileName = selectedFile.name;
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
      const cleanedName = nameWithoutExt.replace(/[-_]/g, ' ');

      const formattedTitle = cleanedName
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      setTitle(formattedTitle);
    }
  };

  /**========================================================
   * Handles the form submission for uploading a resource
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

    try {
      /**=======================================
       * Step 1: Validate for duplicates
       =======================================*/
      setUploadState('validating');
      const isDuplicate = await checkForDuplicates(title);
      if (isDuplicate) {
        toast.error('Duplicate resource', {
          description:
            'A resource with the same title already exists. Please choose a different title.',
        });
        setUploadState('idle');
        return;
      }

      /**=======================================
       * Step 2: Upload file to Jeetix storage
       =======================================*/
      setUploadState('uploading');
      const uploadResponse = await apiClient.uploadToJeetix(file, 'itca-resources');

      /**========================================================
       * Step 3: Create resource in ITCA system using apiClient
       ========================================================*/
      setUploadState('creating');
      const resourcePayload = ResourceAdapter.toCreatePayload({
        title: title.trim(),
        description: description.trim(),
        category: category,
        fileUrls: [uploadResponse.data.fileUrl],
        visibility: visibility,
        academicLevel: academicLevel,
        department: department,
      });

      const createResponse = await apiClient.createResource(resourcePayload, token);

      if (createResponse.status !== 'success') {
        throw new Error(createResponse.message || 'Failed to create resource');
      }

      if (onUploadComplete) {
        onUploadComplete({
          fileName: uploadResponse.data.fileName,
          fileUrl: uploadResponse.data.fileUrl,
          fileType: file.type,
          fileSize: ResourceAdapter.formatFileSize(file.size),
        });
      }

      resetForm();

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
      setUploadState('idle');
    }
  };

  /**=================================================
   * Resets the form fields to their initial state
   =================================================*/
  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setVisibility('all');
    setAcademicLevel('all');
    setDepartment('');

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
    uploadState,
    fileInputRef,
    categories,
    handleFileChange,
    handleSubmit,
    setTitle,
    setDescription,
    setCategory,
    resetForm,
    formatFileSize: ResourceAdapter.formatFileSize,
    visibility,
    setVisibility,
    academicLevel,
    setAcademicLevel,
    department,
    setDepartment,
  };
};

export default useResourceUploader;
