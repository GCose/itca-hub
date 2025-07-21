import { useState, useEffect } from 'react';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import { UserAuth } from '@/types';
import { isLoggedIn } from '@/utils/auth';
import { NextApiRequest } from 'next';
import { useResources } from '@/hooks/admin/resources/use-resources';
import ResourceTable from '@/components/dashboard/table/resource-table';

interface RecycleBinPageProps {
  userData: UserAuth;
}

const RecycleBinPage = ({ userData }: RecycleBinPageProps) => {
  const {
    resources,
    isLoading,
    isError,
    fetchResources,
    permanentlyDeleteResource,
    batchPermanentlyDeleteResource,
    restoreFromRecycleBin,
    batchRestoreFromRecycleBin,
  } = useResources({ token: userData.token });

  const [deletedResources, setDeletedResources] = useState<typeof resources>([]);

  /**==========================================================
   * This effect fetches all resources including deleted ones
   ==========================================================*/
  useEffect(() => {
    const fetchAllResources = async () => {
      await fetchResources(true); // true means include deleted resources
    };

    fetchAllResources();
  }, [fetchResources]);

  /**================================================
   * This effect updates the deletedResources state
   ================================================*/
  useEffect(() => {
    setDeletedResources(resources.filter((r) => r.isDeleted));
  }, [resources]);

  /**============================================
   * Handle permanent delete with title lookup
   ============================================*/
  const handlePermanentDelete = async (resourceId: string): Promise<boolean> => {
    const resource = deletedResources.find((r) => r.resourceId === resourceId);
    if (!resource) return false;
    return await permanentlyDeleteResource(resourceId, resource.title);
  };

  /**===================================
   * Handle restore with title lookup
   ===================================*/
  const handleRestore = async (resourceId: string): Promise<boolean> => {
    const resource = deletedResources.find((r) => r.resourceId === resourceId);
    if (!resource) return false;
    return await restoreFromRecycleBin(resourceId, resource.title);
  };

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
            className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/*==================== Resource Table ====================*/}
      <ResourceTable
        searchTerm=""
        userRole="admin"
        mode="recycleBin"
        isError={isError}
        isLoading={isLoading}
        token={userData.token}
        onClearFilters={() => {}}
        resources={deletedResources}
        allResources={deletedResources}
        onRestoreResource={handleRestore}
        onRefresh={() => fetchResources(true)}
        onDeleteResource={handlePermanentDelete}
        onRestoreMultiple={batchRestoreFromRecycleBin}
        onDeleteMultiple={batchPermanentlyDeleteResource}
      />
      {/*==================== End of Resource Table ====================*/}
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
