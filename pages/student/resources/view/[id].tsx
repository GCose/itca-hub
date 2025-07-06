// import { useRouter } from 'next/router';
// import { ArrowLeft, Download, FileText, Loader, Bookmark, BookmarkCheck } from 'lucide-react';
// import Link from 'next/link';
// import { UserAuth } from '@/types';
// import { isLoggedIn } from '@/utils/auth';
// import { NextApiRequest } from 'next';
// import { useState, useEffect } from 'react';
// import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
// import AudioViewer from '@/components/dashboard/resource-viewers/audio-viewer';
// import GenericViewer from '@/components/dashboard/resource-viewers/generic-viewer';
// import ImageViewer from '@/components/dashboard/resource-viewers/image-viewer';
// import PDFViewer from '@/components/dashboard/resource-viewers/pdf-viewer';
// import TextViewer from '@/components/dashboard/resource-viewers/text-viewer';
// import VideoViewer from '@/components/dashboard/resource-viewers/video-viewer';
// import useResourceAnalytics from '@/hooks/admin/resources/use-resource-analytics';
// import useResourceViewer from '@/hooks/admin/resources/use-resource-viewer';
// import formatDepartment from '@/utils/admin/format-department';

// interface StudentResourceViewPageProps {
//   userData: UserAuth;
// }

// const StudentResourceViewPage = ({ userData }: StudentResourceViewPageProps) => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);
//   const [isDownloading, setIsDownloading] = useState(false);

//   const { resource, isLoading, error, fileType } = useResourceViewer({
//     resourceId: id as string,
//     token: userData.token,
//   });

//   const { trackResourceDownload } = useResourceAnalytics(userData.token);

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

//   // Check if resource is bookmarked
//   const isBookmarked = resource ? bookmarkedResources.includes(resource.id) : false;

//   // Toggle bookmark
//   const toggleBookmark = () => {
//     if (!resource) return;

//     const newBookmarks = isBookmarked
//       ? bookmarkedResources.filter((id) => id !== resource.id)
//       : [...bookmarkedResources, resource.id];

//     localStorage.setItem('bookmarkedResources', JSON.stringify(newBookmarks));
//     setBookmarkedResources(newBookmarks);
//   };

//   // Handle download using mediaUrl
//   const handleDownload = async () => {
//     if (!resource) return;

//     setIsDownloading(true);
//     try {
//       await trackResourceDownload(resource.id);

//       // Get file metadata to get mediaUrl for download
//       const response = await fetch(
//         `https://jeetix-file-service.onrender.com/api/storage/file/${encodeURIComponent(resource.fileName)}`
//       );

//       if (response.ok) {
//         const data = await response.json();
//         if (data.status === 'success' && data.data.metadata?.mediaLink) {
//           // Use mediaLink for download
//           const link = document.createElement('a');
//           link.href = data.data.metadata.mediaLink;
//           link.download = resource.fileName || resource.title || 'resource';
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//           return;
//         }
//       }

//       // Fallback to direct URL
//       const link = document.createElement('a');
//       link.href = resource.fileUrl;
//       link.download = resource.fileName || resource.title || 'resource';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading resource:', error);
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   // Format category name
//   const formatCategory = (category: string) => {
//     return category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
//   };

//   // Render appropriate viewer based on file type
//   const renderViewer = () => {
//     if (!resource) return null;

//     switch (fileType) {
//       case 'pdf':
//         return (
//           <PDFViewer title={resource.title} fileUrl={resource.fileUrl} resourceId={resource.id} />
//         );
//       case 'image':
//         return (
//           <ImageViewer title={resource.title} resourceId={resource.id} fileUrl={resource.fileUrl} />
//         );
//       case 'video':
//         return (
//           <VideoViewer title={resource.title} resourceId={resource.id} fileUrl={resource.fileUrl} />
//         );
//       case 'audio':
//         return (
//           <AudioViewer title={resource.title} resourceId={resource.id} fileUrl={resource.fileUrl} />
//         );
//       case 'text':
//         return (
//           <TextViewer title={resource.title} resourceId={resource.id} fileUrl={resource.fileUrl} />
//         );
//       default:
//         return (
//           <GenericViewer
//             fileUrl={resource.fileUrl}
//             title={resource.title}
//             fileType={resource.type}
//             resourceId={resource.id}
//             token={userData.token}
//           />
//         );
//     }
//   };

//   return (
//     <DashboardLayout title={resource?.title || 'Resource Viewer'}>
//       <div className="mb-8">
//         <div className="flex items-center">
//           <Link
//             href="/student/resources"
//             className="mr-3 inline-flex items-center rounded-lg bg-white p-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-gray-500 focus:ring-offset-2 transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Link>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
//               <span className="text-blue-700 mr-2">Resource</span>
//               <span className="text-amber-500">Viewer</span>
//             </h1>
//             <p className="text-gray-600">View and download educational resource</p>
//           </div>
//         </div>
//       </div>

//       {/*==================== Loading State ====================*/}
//       {isLoading && (
//         <div className="flex items-center justify-center h-96 bg-white rounded-xl">
//           <div className="flex flex-col items-center">
//             <Loader className="h-8 w-8 text-blue-600 animate-spin mb-3" />
//             <p className="text-gray-600">Loading resource...</p>
//           </div>
//         </div>
//       )}
//       {/*==================== End of Loading State ====================*/}

//       {/*==================== Error State ====================*/}
//       {error && (
//         <div className="flex items-center justify-center h-96 bg-white rounded-xl">
//           <div className="flex flex-col items-center">
//             <FileText className="h-16 w-16 text-red-400 mb-3" />
//             <h3 className="text-lg font-medium text-gray-900 mb-1">Resource Not Found</h3>
//             <p className="text-gray-500 mb-4">{error}</p>
//             <Link
//               href="/student/resources"
//               className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Return to Resources
//             </Link>
//           </div>
//         </div>
//       )}
//       {/*==================== End of Error State ====================*/}

//       {/*==================== Resource Content ====================*/}
//       {!isLoading && !error && resource && (
//         <div className="space-y-6">
//           {/*==================== Resource Info Card ====================*/}
//           <div className="bg-white rounded-2xl overflow-hidden">
//             <div className="px-6 py-5">
//               <div className="flex justify-between items-start">
//                 <div className="flex-1">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h2>
//                   <p className="text-sm text-gray-600 mb-4">{resource.description}</p>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <div>
//                       <p className="text-xs text-gray-500">CATEGORY</p>
//                       <p className="text-sm font-medium">{formatCategory(resource.category)}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">DEPARTMENT</p>
//                       <p className="text-sm font-medium">{formatDepartment(resource.department)}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">FILE TYPE</p>
//                       <p className="text-sm font-medium">
//                         {resource?.type?.toUpperCase() || 'Unknown'}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">FILE SIZE</p>
//                       <p className="text-sm font-medium">{resource.fileSize}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-2 ml-4">
//                   <button
//                     onClick={toggleBookmark}
//                     className={`p-2 rounded-lg transition-colors ${
//                       isBookmarked
//                         ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
//                         : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
//                     }`}
//                     title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
//                   >
//                     {isBookmarked ? (
//                       <BookmarkCheck className="h-5 w-5" />
//                     ) : (
//                       <Bookmark className="h-5 w-5" />
//                     )}
//                   </button>

//                   <button
//                     onClick={handleDownload}
//                     disabled={isDownloading}
//                     className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
//                   >
//                     {isDownloading ? (
//                       <>
//                         <Loader className="mr-2 h-4 w-4 animate-spin" />
//                         Downloading...
//                       </>
//                     ) : (
//                       <>
//                         <Download className="mr-2 h-4 w-4" />
//                         Download
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/*==================== End of Resource Info Card ====================*/}

//           {/*==================== Resource Viewer Card ====================*/}
//           <div className="bg-white/50 rounded-2xl overflow-hidden">
//             <div className="h-[800px]">{renderViewer()}</div>
//           </div>
//           {/*==================== End of Resource Viewer Card ====================*/}
//         </div>
//       )}
//       {/*==================== End of Resource Content ====================*/}
//     </DashboardLayout>
//   );
// };

// export default StudentResourceViewPage;

// export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
//   const userData = isLoggedIn(req);

//   if (userData === false) {
//     return {
//       redirect: {
//         destination: '/auth',
//         permanent: false,
//       },
//     };
//   }

//   const userAuth = userData as UserAuth;

//   if (userAuth.role === 'admin') {
//     return {
//       redirect: {
//         destination: '/admin',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       userData,
//     },
//   };
// };
