// import { useState } from 'react';
// import { Search, Filter, Bookmark, FileText, Grid, List } from 'lucide-react';
// import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
// import { UserAuth } from '@/types';
// import { isLoggedIn } from '@/utils/auth';
// import { NextApiRequest } from 'next';
// import { useStudentResources } from '@/hooks/student/resources/use-student-resources';
// import ResourceCard from '@/components/dashboard/student/resource/resource-card';
// import ResourceFilters from '@/components/dashboard/student/resource/resource-filter';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import formatDepartment from '@/utils/admin/format-department';

// interface StudentResourcesPageProps {
//   userData: UserAuth;
// }

// const StudentResourcesPage = ({ userData }: StudentResourcesPageProps) => {
//   const router = useRouter();
//   const {
//     resources,
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
//     bookmarkedResources,
//     toggleBookmark,
//     isBookmarked,
//     handleView,
//     handleDownload,
//     refetch,
//   } = useStudentResources(userData.token);

//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [showFilters, setShowFilters] = useState(false);

//   // Get unique categories for filtering
//   const categories = [...new Set(resources.map((r) => r.category))];
//   const departments = ['computer_science', 'information_systems', 'telecommunications'];
//   const academicLevels = ['undergraduate', 'postgraduate', 'all'];

//   // Handle resource view - navigate to viewer page
//   const handleResourceView = async (resourceId: string) => {
//     await handleView(resourceId); // Track the view
//     router.push(`/student/resources/view/${resourceId}`);
//   };

//   if (error) {
//     return (
//       <DashboardLayout title="Resources">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <p className="text-red-500 mb-4">Error loading resources: {error}</p>
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
//     <DashboardLayout title="Resources">
//       <div className="mb-8">
//         {/*==================== Header ====================*/}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
//               <span className="text-blue-700 mr-2">Educational</span>
//               <span className="text-amber-500">Resources</span>
//             </h1>
//             <p className="text-gray-600">
//               Access lecture notes, assignments, past papers, and more educational materials
//             </p>
//           </div>

//           <div className="mt-4 sm:mt-0 flex space-x-3">
//             <Link
//               href="/student/resources/bookmarks"
//               className="inline-flex items-center rounded-lg bg-amber-50 text-amber-600 px-4 py-2 text-sm font-medium hover:bg-amber-100"
//             >
//               <Bookmark className="mr-2 h-4 w-4" />
//               Bookmarked ({bookmarkedResources.length})
//             </Link>
//           </div>
//         </div>
//         {/*==================== End of Header ====================*/}

//         {/*==================== Search and Controls ====================*/}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-12 mb-6">
//           <div className="md:col-span-8">
//             <div className="relative">
//               <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search resources by title or description..."
//                 className="w-full rounded-lg bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-blue-600 transition-colors"
//               />
//             </div>
//           </div>

//           <div className="md:col-span-2">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="w-full inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200"
//             >
//               <Filter className="mr-2 h-4 w-4" />
//               Filters
//             </button>
//           </div>

//           <div className="md:col-span-2">
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
//         {/*==================== End of Search and Controls ====================*/}

//         {/*==================== Filters Panel ====================*/}
//         {showFilters && (
//           <ResourceFilters
//             department={department}
//             setDepartment={setDepartment}
//             category={category}
//             setCategory={setCategory}
//             academicLevel={academicLevel}
//             setAcademicLevel={setAcademicLevel}
//             departments={departments}
//             categories={categories}
//             academicLevels={academicLevels}
//           />
//         )}
//         {/*==================== End of Filters Panel ====================*/}
//       </div>

//       {/*==================== Results Summary ====================*/}
//       <div className="mb-6 flex items-center justify-between">
//         <p className="text-sm text-gray-600">
//           Showing {resources.length} resources
//           {department !== 'all' && ` in ${formatDepartment(department)}`}
//           {category !== 'all' && ` • ${category.replace('_', ' ')}`}
//           {academicLevel !== 'all' && ` • ${academicLevel}`}
//         </p>
//         {(department !== 'all' || category !== 'all' || academicLevel !== 'all' || searchTerm) && (
//           <button
//             onClick={() => {
//               setDepartment('all');
//               setCategory('all');
//               setAcademicLevel('all');
//               setSearchTerm('');
//             }}
//             className="text-sm text-blue-600 hover:text-blue-800"
//           >
//             Clear all filters
//           </button>
//         )}
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

//       {/*==================== Resources Grid/List ====================*/}
//       {!isLoading && resources.length === 0 && (
//         <div className="text-center py-12">
//           <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
//           <p className="text-gray-500">
//             {searchTerm || department !== 'all' || category !== 'all' || academicLevel !== 'all'
//               ? 'Try adjusting your search criteria or filters.'
//               : 'No resources are currently available.'}
//           </p>
//         </div>
//       )}

//       {!isLoading && resources.length > 0 && (
//         <div
//           className={
//             viewMode === 'grid'
//               ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
//               : 'space-y-4'
//           }
//         >
//           {resources.map((resource) => (
//             <ResourceCard
//               key={resource.id}
//               resource={resource}
//               viewMode={viewMode}
//               isBookmarked={isBookmarked(resource.id)}
//               onToggleBookmark={() => toggleBookmark(resource.id)}
//               onView={() => handleResourceView(resource.id)}
//               onDownload={() => handleDownload(resource)}
//             />
//           ))}
//         </div>
//       )}
//       {/*==================== End of Resources Grid/List ====================*/}
//     </DashboardLayout>
//   );
// };

// export default StudentResourcesPage;

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
