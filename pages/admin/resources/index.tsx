import { useEffect } from 'react';
import { useResources } from '@/hooks/admin/use-resources';
import { Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ResourceTable from '@/components/dashboard/admin/resources/table/resource-table';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import { UserAuth } from '@/types';
import { isLoggedIn } from '@/utils/auth';
import { NextApiRequest } from 'next';

const AdminResourcesPage = () => {
  const { resources, isLoading, isError, fetchResources, moveToRecycleBin, batchMoveToRecycleBin } =
    useResources();

  useEffect(() => {
    // Only fetch non-deleted resources for the main page
    fetchResources(false);
  }, [fetchResources]);

  // Handle deleting a single resource
  const handleDeleteResource = async (resourceId: string): Promise<boolean> => {
    try {
      // Find the resource to get its title
      const resource = resources.find((r) => r.id === resourceId);
      if (!resource) return false;

      // Call the move to recycle bin function
      return await moveToRecycleBin(resourceId, resource.title);
    } catch (err) {
      console.error('Error deleting resource:', err);
      return false;
    }
  };

  // Handle deleting multiple resources
  const handleDeleteMultiple = async (resourceIds: string[]): Promise<boolean> => {
    try {
      return await batchMoveToRecycleBin(resourceIds);
    } catch (err) {
      console.error('Error deleting multiple resources:', err);
      return false;
    }
  };

  return (
    <DashboardLayout title="Resource Management">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/*==================== Page Title Header ====================*/}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-blue-700 mr-2">Resource</span>
              <span className="text-amber-500">Management</span>
              <span className="ml-3 relative">
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              </span>
            </h1>
            <p className="text-gray-600">Upload and manage educational resources and materials</p>
          </div>
          {/*==================== End of Page Title Header ====================*/}

          <div className="mt-4 sm:mt-0 flex space-x-3">
            {/*==================== Recycle Bin Link ====================*/}
            <Link
              href="/admin/resources/recycle-bin"
              className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Recycle Bin
            </Link>
            {/*==================== End of Recycle Bin Link ====================*/}

            {/*==================== Upload Resource Link ====================*/}
            <Link
              href="/admin/resources/upload"
              className="group inline-flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Upload className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-[-2px]" />
              Upload Resource
            </Link>
            {/*==================== End of Upload Resource Link ====================*/}
          </div>
        </div>
      </div>

      {/*==================== Resource Table ====================*/}
      <ResourceTable
        isError={isError}
        resources={resources}
        isLoading={isLoading}
        onDeleteResource={handleDeleteResource}
        onDeleteMultiple={handleDeleteMultiple}
        onRefresh={() => fetchResources(false)}
      />
      {/*==================== End of Resource Table ====================*/}
    </DashboardLayout>
  );
};

export default AdminResourcesPage;

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
