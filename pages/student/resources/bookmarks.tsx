// import { useState } from 'react';
// import { ArrowLeft, Bookmark, FileText, Grid, List } from 'lucide-react';
// import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
// import { UserAuth } from '@/types';
// import { isLoggedIn } from '@/utils/auth';
// import { NextApiRequest } from 'next';
// import { useStudentResources } from '@/hooks/student/resources/use-student-resources';
// import ResourceCard from '@/components/dashboard/student/resource/resource-card';
// import Link from 'next/link';

// interface StudentBookmarksPageProps {
//   userData: UserAuth;
// }

// const StudentBookmarksPage = ({ userData }: StudentBookmarksPageProps) => {
//   const {
//     bookmarkedResources,
//     toggleBookmark,
//     isBookmarked,
//     handleView,
//     handleDownload,
//     isLoading,
//     error,
//     refetch,
//   } = useStudentResources(userData.token);

//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

//   if (error) {
//     return (
//       <DashboardLayout title="Bookmarked Resources">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <p className="text-red-500 mb-4">Error loading bookmarks: {error}</p>
//             <button
//               onClick={refetch}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout title="Bookmarked Resources">
//       <div className="mb-8">
//         {/*==================== Header ====================*/}
//         <div className="flex items-center mb-6">
//           <Link
//             href="/student/resources"
//             className="mr-3 inline-flex items-center rounded-lg bg-white p-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-gray-500 focus:ring-offset-2 transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Link>
//           <div className="flex-1">
//             <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
//               <span className="text-blue-700 mr-2">Bookmarked</span>
//               <span className="text-amber-500">Resources</span>
//               <Bookmark className="ml-3 h-6 w-6 text-amber-500" />
//             </h1>
//             <p className="text-gray-600">Your saved educational resources for quick access</p>
//           </div>

//           <div className="flex items-center space-x-3">
//             <div className="flex items-center justify-center h-full rounded-lg bg-white overflow-hidden border border-gray-200">
//               <button
//                 className={`flex-1 h-full flex items-center justify-center px-3 py-2.5 transition-colors ${
//                   viewMode === 'grid'
//                     ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700'
//                     : 'text-gray-500 hover:bg-gray-50'
//                 }`}
//                 onClick={() => setViewMode('grid')}
//               >
//                 <Grid className="h-4 w-4" />
//               </button>
//               <div className="h-full w-px bg-gray-200"></div>
//               <button
//                 className={`flex-1 h-full flex items-center justify-center px-3 py-2.5 transition-colors ${
//                   viewMode === 'list'
//                     ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700'
//                     : 'text-gray-500 hover:bg-gray-50'
//                 }`}
//                 onClick={() => setViewMode('list')}
//               >
//                 <List className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//         {/*==================== End of Header ====================*/}
//       </div>

//       {/*==================== Results Summary ====================*/}
//       <div className="mb-6 flex items-center justify-between">
//         <p className="text-sm text-gray-600">
//           {bookmarkedResources.length} bookmarked resource
//           {bookmarkedResources.length !== 1 ? 's' : ''}
//         </p>
//       </div>
//       {/*==================== End of Results Summary ====================*/}

//       {/*==================== Loading State ====================*/}
//       {isLoading && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
//               <div className="h-4 bg-gray-200 rounded mb-4"></div>
//               <div className="h-3 bg-gray-200 rounded mb-2"></div>
//               <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
//               <div className="flex justify-between items-center">
//                 <div className="h-6 bg-gray-200 rounded w-16"></div>
//                 <div className="h-6 bg-gray-200 rounded w-20"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       {/*==================== End of Loading State ====================*/}

//       {/*==================== Empty State ====================*/}
//       {!isLoading && bookmarkedResources.length === 0 && (
//         <div className="text-center py-12">
//           <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarked resources</h3>
//           <p className="text-gray-500 mb-4">
//             Start bookmarking resources to access them quickly later.
//           </p>
//           <Link
//             href="/student/resources"
//             className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2"
//           >
//             <FileText className="mr-2 h-4 w-4" />
//             Browse Resources
//           </Link>
//         </div>
//       )}
//       {/*==================== End of Empty State ====================*/}

//       {/*==================== Bookmarked Resources Grid/List ====================*/}
//       {!isLoading && bookmarkedResources.length > 0 && (
//         <div
//           className={
//             viewMode === 'grid'
//               ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
//               : 'space-y-4'
//           }
//         >
//           {bookmarkedResources.map((resource) => (
//             <ResourceCard
//               key={resource.id}
//               resource={resource}
//               viewMode={viewMode}
//               onView={() => handleView(resource.id)}
//               isBookmarked={isBookmarked(resource.id)}
//               onDownload={() => handleDownload(resource)}
//               onToggleBookmark={() => toggleBookmark(resource.id)}
//             />
//           ))}
//         </div>
//       )}
//       {/*==================== End of Bookmarked Resources Grid/List ====================*/}
//     </DashboardLayout>
//   );
// };

// export default StudentBookmarksPage;

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
