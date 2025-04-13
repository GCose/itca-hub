import { useState, useEffect } from 'react';
import { useResources } from '@/hooks/admin/use-resources';
import {
  Trash2,
  RefreshCw,
  RotateCcw,
  ArrowLeft,
  X,
  AlertTriangle,
  Loader,
  BookOpen,
  FileQuestion,
  GraduationCap,
  BookMarked,
  ScrollText,
  FileCode,
  File,
} from 'lucide-react';
import Link from 'next/link';
import { NetworkError } from '@/components/error-message';
import formatDepartment from '@/utils/admin/format-department';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAuth } from '@/types';
import { isLoggedIn } from '@/utils/auth';
import { NextApiRequest } from 'next';

const RecycleBinPage = () => {
  const {
    resources,
    isLoading,
    isError,
    fetchResources,
    permanentlyDeleteResource,
    restoreFromRecycleBin,
  } = useResources();

  const [deletedResources, setDeletedResources] = useState<typeof resources>([]);
  const [selectedResource, setSelectedResource] = useState<(typeof resources)[0] | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Fetch all resources including deleted ones
  useEffect(() => {
    const fetchAllResources = async () => {
      await fetchResources(true); // true means include deleted resources
    };

    fetchAllResources();
  }, [fetchResources]);

  // Filter for deleted resources only
  useEffect(() => {
    setDeletedResources(resources.filter((r) => r.isDeleted));
  }, [resources]);

  // Handle permanent deletion confirmation
  const handleConfirmDelete = async () => {
    if (!selectedResource) return;

    setIsDeleting(true);
    try {
      const success = await permanentlyDeleteResource(
        selectedResource.fileName,
        selectedResource.title
      );

      if (success) {
        setDeletedResources((prev) => prev.filter((r) => r.id !== selectedResource.id));
        setShowDeleteModal(false);
        setSelectedResource(null);
      }
    } catch (err) {
      console.error('Error permanently deleting resource:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle restore confirmation
  const handleConfirmRestore = async () => {
    if (!selectedResource) return;

    setIsRestoring(true);
    try {
      const success = await restoreFromRecycleBin(selectedResource.id, selectedResource.title);

      if (success) {
        setDeletedResources((prev) => prev.filter((r) => r.id !== selectedResource.id));
        setShowRestoreModal(false);
        setSelectedResource(null);
      }
    } catch (err) {
      console.error('Error restoring resource:', err);
    } finally {
      setIsRestoring(false);
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Lecture Notes':
        return <BookOpen className="h-4 w-4 text-blue-500 mr-1" />;
      case 'Assignments':
        return <ScrollText className="h-4 w-4 text-green-500 mr-1" />;
      case 'Past Papers':
        return <FileQuestion className="h-4 w-4 text-orange-500 mr-1" />;
      case 'Tutorials':
        return <GraduationCap className="h-4 w-4 text-purple-500 mr-1" />;
      case 'Textbooks':
        return <BookMarked className="h-4 w-4 text-red-500 mr-1" />;
      case 'Research Papers':
        return <FileCode className="h-4 w-4 text-indigo-500 mr-1" />;
      default:
        return <File className="h-4 w-4 text-gray-500 mr-1" />;
    }
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDeleteModal(false);
        setShowRestoreModal(false);
      }
    };

    if (showDeleteModal || showRestoreModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [showDeleteModal, showRestoreModal]);

  return (
    <DashboardLayout title="Recycle Bin">
      <div className="mb-8">
        <div className="flex items-center">
          <Link
            href="/admin/resources"
            className="mr-3 inline-flex items-center rounded-lg bg-white p-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-blue-700 mr-2">Recycle</span>
              <span className="text-amber-500">Bin</span>
              <span className="ml-3 relative">
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              </span>
            </h1>
            <p className="text-gray-600">
              View and manage deleted resources. Items remain here for 30 days before being
              permanently removed.
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => fetchResources(true)}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/*==================== Error State ====================*/}
      {isError && (
        <NetworkError title="Unable to load recycle bin" onRetry={() => fetchResources(true)} />
      )}
      {/*==================== End of Error State ====================*/}

      {/*==================== Empty State ====================*/}
      {!isError && !isLoading && deletedResources.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center">
          <Trash2 className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Recycle Bin is Empty</h3>
          <p className="text-gray-500 mb-4">
            No resources have been deleted. Deleted resources will appear here.
          </p>
          <div className="flex justify-center">
            <Link
              href="/admin/resources"
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Resources
            </Link>
          </div>
        </div>
      )}
      {/*==================== End of Empty State ====================*/}

      {/*==================== Resource List ====================*/}
      {!isError && !isLoading && deletedResources.length > 0 && (
        <div className="rounded-2xl bg-white">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Deleted Resources</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Resource
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Deleted On
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {deletedResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[250px]">
                        {resource.description}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                        {formatDepartment(resource.department)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                        {getCategoryIcon(resource.category)}
                        {resource.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(resource.deletedAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedResource(resource);
                            setShowRestoreModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <div className="flex items-center">
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Restore
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedResource(resource);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <div className="flex items-center">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete Permanently
                          </div>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/*==================== End of Resource List ====================*/}

      {/*==================== Restore Confirmation Modal ====================*/}
      <AnimatePresence>
        {showRestoreModal && selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/*==================== Background overlay ====================*/}
            <motion.div
              onClick={() => !isRestoring && setShowRestoreModal(false)}
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            {/*==================== End of Background overlay ====================*/}

            {/*==================== Modal Content ====================*/}
            <motion.div
              className="relative w-full max-w-md rounded-xl bg-white shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
            >
              <div className="relative p-6">
                <div className="mb-5 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <RotateCcw className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Restore Resource</h3>
                  </div>

                  <button
                    title="button"
                    type="button"
                    className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    onClick={() => setShowRestoreModal(false)}
                    disabled={isRestoring}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    Are you sure you want to restore &quot;
                    {selectedResource.title}
                    &quot;? It will be moved back to your active resources.
                  </p>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{selectedResource.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Type: {selectedResource.type.toUpperCase()} • Size:{' '}
                      {selectedResource.fileSize}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Category: {selectedResource.category} • Visibility:{' '}
                      {selectedResource.visibility === 'all' ? 'All Users' : 'Admin Only'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => setShowRestoreModal(false)}
                    disabled={isRestoring}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70"
                    onClick={handleConfirmRestore}
                    disabled={isRestoring}
                  >
                    {isRestoring ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Restoring...
                      </>
                    ) : (
                      'Restore Resource'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
            {/*==================== End of Modal Content ====================*/}
          </div>
        )}
      </AnimatePresence>
      {/*==================== End of Restore Confirmation Modal ====================*/}

      {/*==================== Delete Confirmation Modal ====================*/}
      <AnimatePresence>
        {showDeleteModal && selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/*==================== Background overlay ====================*/}
            <motion.div
              onClick={() => !isDeleting && setShowDeleteModal(false)}
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            {/*==================== End of Background overlay ====================*/}

            {/*==================== Modal Content ====================*/}
            <motion.div
              className="relative w-full max-w-md rounded-xl bg-white shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
            >
              <div className="relative p-6">
                <div className="mb-5 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Permanently Delete Resource
                    </h3>
                  </div>

                  <button
                    title="button"
                    type="button"
                    className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    Are you sure you want to permanently delete &quot;
                    {selectedResource.title}&quot;? This action cannot be undone.
                  </p>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{selectedResource.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Type: {selectedResource.type.toUpperCase()} • Size:{' '}
                      {selectedResource.fileSize}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Category: {selectedResource.category} • Visibility:{' '}
                      {selectedResource.visibility === 'all' ? 'All Users' : 'Admin Only'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Permanently'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
            {/*==================== End of Modal Content ====================*/}
          </div>
        )}
      </AnimatePresence>
      {/*==================== End of Delete Confirmation Modal ====================*/}
    </DashboardLayout>
  );
};

export default RecycleBinPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const userData = isLoggedIn(req);

  if (userData === false) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  const userAuth = userData as UserAuth;

  if (userAuth.role === 'user') {
    return {
      redirect: {
        destination: '/student',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userData,
    },
  };
};
