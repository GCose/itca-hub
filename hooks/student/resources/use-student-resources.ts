// import { useState, useEffect, useCallback } from 'react';
// import { BASE_URL } from '@/utils/url';
// import { Resource } from '@/types';
// import useResourceAnalytics from '@/hooks/admin/resources/use-resource-analytics';

// interface ApiResource {
//   _id: string;
//   title: string;
//   description: string;
//   category: string;
//   downloads: number;
//   viewCount: number;
//   fileUrls: string[];
//   visibility: 'all' | 'admin';
//   academicLevel: string;
//   department: string;
//   isDeleted: boolean;
//   deletedAt?: string;
//   deletedBy?: string;
//   createdBy: string;
//   updatedBy?: string;
//   createdAt: string;
//   updatedAt: string;
//   resourceId: string;
// }

// // Helper function to ensure academicLevel is properly typed
// const normalizeAcademicLevel = (level: string): 'undergraduate' | 'postgraduate' | 'all' => {
//   const normalizedLevel = level.toLowerCase();
//   if (
//     normalizedLevel === 'undergraduate' ||
//     normalizedLevel === 'postgraduate' ||
//     normalizedLevel === 'all'
//   ) {
//     return normalizedLevel as 'undergraduate' | 'postgraduate' | 'all';
//   }
//   return 'all';
// };

// // Convert API resource to frontend format
// const convertApiResource = async (apiResource: ApiResource): Promise<Resource> => {
//   const fileExtension = apiResource.fileUrls[0]?.split('.').pop()?.toLowerCase() || 'unknown';
//   const fileName = apiResource.fileUrls[0]?.split('/').pop() || '';

//   // Get file size from Jeetix metadata
//   let fileSize = 'Unknown';
//   if (fileName) {
//     try {
//       const response = await fetch(
//         `https://jeetix-file-service.onrender.com/api/storage/metadata/${encodeURIComponent(fileName)}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         if (data.status === 'success' && data.data.size) {
//           const sizeInBytes = parseInt(data.data.size);
//           if (sizeInBytes) {
//             const units = ['B', 'KB', 'MB', 'GB', 'TB'];
//             let size = sizeInBytes;
//             let unitIndex = 0;
//             while (size >= 1024 && unitIndex < units.length - 1) {
//               size /= 1024;
//               unitIndex++;
//             }
//             fileSize = `${size.toFixed(2)} ${units[unitIndex]}`;
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching file metadata:', error);
//     }
//   }

//   return {
//     id: apiResource._id,
//     title: apiResource.title,
//     description: apiResource.description,
//     type: fileExtension,
//     category: apiResource.category,
//     dateUploaded: new Date(apiResource.createdAt).toISOString().split('T')[0],
//     fileSize,
//     downloads: apiResource.downloads,
//     viewCount: apiResource.viewCount,
//     fileUrl: apiResource.fileUrls[0] || '',
//     fileName,
//     visibility: apiResource.visibility,
//     academicLevel: normalizeAcademicLevel(apiResource.academicLevel),
//     department: apiResource.department || 'computer-science',
//     isDeleted: apiResource.isDeleted,
//     deletedAt: apiResource.deletedAt,
//     deletedBy: apiResource.deletedBy,
//   };
// };

// export const useStudentResources = (token: string) => {
//   const [resources, setResources] = useState<Resource[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [department, setDepartment] = useState('all');
//   const [category, setCategory] = useState('all');
//   const [academicLevel, setAcademicLevel] = useState('all');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);

//   const { trackResourceView, trackResourceDownload } = useResourceAnalytics(token);

//   /**===========================================================================================
//    * Fetches resources from the API and filters them based on visibility and deletion status.
//    ===========================================================================================*/
//   const fetchResources = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${BASE_URL}/resources`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch resources');
//       }

//       const data = await response.json();

//       if (data.status === 'success' && data.data.resources) {
//         // Filter out deleted resources and only show visible ones
//         const visibleResources = data.data.resources.filter(
//           (apiResource: ApiResource) =>
//             !apiResource.isDeleted &&
//             (apiResource.visibility === 'all' || apiResource.visibility === 'admin')
//         );

//         // Convert resources with metadata
//         const mappedResources = await Promise.all(
//           visibleResources.map((apiResource: ApiResource) => convertApiResource(apiResource))
//         );

//         setResources(mappedResources);
//       } else {
//         throw new Error('Invalid response format');
//       }
//     } catch (err) {
//       console.error('Error fetching resources:', err);
//       setError(err instanceof Error ? err.message : 'Failed to load resources');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [token]);

//   // Load bookmarked resources from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem('bookmarkedResources');
//     if (saved) {
//       try {
//         setBookmarkedResources(JSON.parse(saved));
//       } catch (error) {
//         console.error('Error loading bookmarks:', error);
//         setBookmarkedResources([]);
//       }
//     }
//   }, []);

//   // Save bookmarked resources to localStorage
//   const saveBookmarks = useCallback((bookmarks: string[]) => {
//     localStorage.setItem('bookmarkedResources', JSON.stringify(bookmarks));
//     setBookmarkedResources(bookmarks);
//   }, []);

//   // Toggle bookmark
//   const toggleBookmark = useCallback(
//     (resourceId: string) => {
//       const newBookmarks = bookmarkedResources.includes(resourceId)
//         ? bookmarkedResources.filter((id) => id !== resourceId)
//         : [...bookmarkedResources, resourceId];

//       saveBookmarks(newBookmarks);
//     },
//     [bookmarkedResources, saveBookmarks]
//   );

//   // Check if resource is bookmarked
//   const isBookmarked = useCallback(
//     (resourceId: string) => {
//       return bookmarkedResources.includes(resourceId);
//     },
//     [bookmarkedResources]
//   );

//   // Filter resources based on search and filters
//   const filteredResources = resources.filter((resource) => {
//     const matchesSearch =
//       !searchTerm ||
//       resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       resource.description.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesDepartment = department === 'all' || resource.department === department;
//     const matchesCategory = category === 'all' || resource.category === category;
//     const matchesLevel = academicLevel === 'all' || resource.academicLevel === academicLevel;

//     return matchesSearch && matchesDepartment && matchesCategory && matchesLevel;
//   });

//   // Get bookmarked resources
//   const getBookmarkedResources = useCallback(() => {
//     return resources.filter((resource) => bookmarkedResources.includes(resource.id));
//   }, [resources, bookmarkedResources]);

//   /**=======================================================
//    * Handles viewing a resource by tracking the view count.
//    =======================================================*/
//   const handleView = useCallback(
//     async (resourceId: string) => {
//       try {
//         await trackResourceView(resourceId);
//       } catch (error) {
//         console.error('Error tracking view:', error);
//       }
//     },
//     [trackResourceView]
//   );

//   /**====================================================
//    * Handles downloading a resource file using mediaUrl
//    ====================================================*/
//   const handleDownload = useCallback(
//     async (resource: Resource) => {
//       try {
//         // Track download first
//         await trackResourceDownload(resource.id);

//         // Get file metadata to get mediaUrl for download
//         const response = await fetch(
//           `https://jeetix-file-service.onrender.com/api/storage/file/${encodeURIComponent(resource.fileName)}`
//         );

//         if (response.ok) {
//           const data = await response.json();
//           if (data.status === 'success' && data.data.metadata?.mediaLink) {
//             // Use mediaLink for download
//             const link = document.createElement('a');
//             link.href = data.data.metadata.mediaLink;
//             link.download = resource.fileName || resource.title || 'resource';
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             return;
//           }
//         }

//         // Fallback to direct URL if mediaLink is not available
//         const link = document.createElement('a');
//         link.href = resource.fileUrl;
//         link.download = resource.fileName || resource.title || 'resource';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       } catch (error) {
//         console.error('Error downloading resource:', error);
//       }
//     },
//     [trackResourceDownload]
//   );

//   // Initial fetch
//   useEffect(() => {
//     fetchResources();
//   }, [fetchResources]);

//   return {
//     resources: filteredResources,
//     searchTerm,
//     setSearchTerm,
//     department,
//     setDepartment,
//     category,
//     setCategory,
//     academicLevel,
//     setAcademicLevel,
//     isLoading,
//     error,
//     bookmarkedResources: getBookmarkedResources(),
//     toggleBookmark,
//     isBookmarked,
//     handleView,
//     handleDownload,
//     refetch: fetchResources,
//   };
// };
