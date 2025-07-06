import { useState } from 'react';
import {
  FileText,
  Download,
  Bookmark,
  BookmarkCheck,
  Eye,
  Calendar,
  File,
  Image as ImageIcon,
  Video,
  FileCode,
  BookOpen,
  ScrollText,
  FileQuestion,
  GraduationCap,
  BookMarked,
} from 'lucide-react';
import { Resource } from '@/types';
import formatDepartment from '@/utils/admin/format-department';

interface ResourceCardProps {
  resource: Resource;
  viewMode: 'grid' | 'list';
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onView: () => void;
  onDownload: () => void;
}

const ResourceCard = ({
  resource,
  viewMode,
  isBookmarked,
  onToggleBookmark,
  onView,
  onDownload,
}: ResourceCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Get file icon based on type
  const getFileIcon = () => {
    const type = resource.type.toLowerCase();

    if (['pdf'].includes(type)) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    if (['doc', 'docx'].includes(type)) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) {
      return <ImageIcon className="h-5 w-5 text-purple-500" />;
    }
    if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(type)) {
      return <Video className="h-5 w-5 text-blue-500" />;
    }
    if (['txt', 'md', 'json', 'xml', 'css', 'js', 'html'].includes(type)) {
      return <FileCode className="h-5 w-5 text-green-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  // Get category icon
  const getCategoryIcon = () => {
    switch (resource.category) {
      case 'lecture_note':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'assignment':
        return <ScrollText className="h-4 w-4 text-green-500" />;
      case 'past_papers':
        return <FileQuestion className="h-4 w-4 text-orange-500" />;
      case 'tutorial':
        return <GraduationCap className="h-4 w-4 text-purple-500" />;
      case 'textbook':
        return <BookMarked className="h-4 w-4 text-red-500" />;
      case 'research_papers':
        return <FileCode className="h-4 w-4 text-indigo-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  // Handle download with loading state
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  // Format category name
  const formatCategory = (category: string) => {
    return category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow border border-gray-100">
        <div className="flex items-center justify-between">
          {/*==================== Resource Info ====================*/}
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              {getFileIcon()}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 truncate mb-1">{resource.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{resource.description}</p>

              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  {getCategoryIcon()}
                  <span className="ml-1">{formatCategory(resource.category)}</span>
                </div>
                <span>{formatDepartment(resource.department)}</span>
                <span>{resource.fileSize}</span>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {resource.dateUploaded}
                </div>
              </div>
            </div>
          </div>
          {/*==================== End of Resource Info ====================*/}

          {/*==================== Actions ====================*/}
          <div className="flex items-center space-x-2 ml-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500 mr-4">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {resource.viewCount}
              </div>
              <div className="flex items-center">
                <Download className="h-4 w-4 mr-1" />
                {resource.downloads}
              </div>
            </div>

            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                  : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={onView}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              title="View resource"
            >
              <Eye className="h-4 w-4" />
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
              title="Download resource"
            >
              <Download className={`h-4 w-4 ${isDownloading ? 'animate-bounce' : ''}`} />
            </button>
          </div>
          {/*==================== End of Actions ====================*/}
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100">
      {/*==================== Header ====================*/}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            {getFileIcon()}
          </div>
          <div className="flex items-center">
            {getCategoryIcon()}
            <span className="ml-1 text-sm text-gray-600">{formatCategory(resource.category)}</span>
          </div>
        </div>

        <button
          onClick={onToggleBookmark}
          className={`p-1.5 rounded-lg transition-colors ${
            isBookmarked
              ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
              : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>
      {/*==================== End of Header ====================*/}

      {/*==================== Content ====================*/}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{resource.description}</p>
      </div>
      {/*==================== End of Content ====================*/}

      {/*==================== Metadata ====================*/}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span>{formatDepartment(resource.department)}</span>
        <span>{resource.fileSize}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {resource.dateUploaded}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {resource.viewCount}
          </div>
          <div className="flex items-center">
            <Download className="h-3 w-3 mr-1" />
            {resource.downloads}
          </div>
        </div>
      </div>
      {/*==================== End of Metadata ====================*/}

      {/*==================== Actions ====================*/}
      <div className="flex space-x-2">
        <button
          onClick={onView}
          className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 inline-flex items-center justify-center rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
        >
          <Download className={`h-4 w-4 mr-1 ${isDownloading ? 'animate-bounce' : ''}`} />
          {isDownloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
      {/*==================== End of Actions ====================*/}
    </div>
  );
};

export default ResourceCard;
