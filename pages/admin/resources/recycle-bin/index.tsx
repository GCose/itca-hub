import Link from 'next/link';
import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { ArrowLeft } from 'lucide-react';
import { isLoggedIn } from '@/utils/auth';
import { useState, useEffect } from 'react';
import useResources from '@/hooks/resources/use-resource';
import { RecycleBinPageProps } from '@/types/interfaces/resource';
import useResourceAdmin from '@/hooks/resources/use-resource-admin';
import ResourceTable from '@/components/dashboard/table/resource-table';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';

const RecycleBinPage = ({ userData }: RecycleBinPageProps) => {
  const { resources, isLoading, pagination, fetchResources } = useResources({
    token: userData.token,
  });

  const { toggleResourceTrash, deleteResourcePermanently } = useResourceAdmin({
    token: userData.token,
  });

  const [deletedResources, setDeletedResources] = useState<typeof resources>([]);

  useEffect(() => {
    const fetchAllResources = async () => {
      await fetchResources({
        includeDeleted: true,
        page: pagination.currentPage,
        limit: pagination.limit,
      });
    };

    fetchAllResources();
  }, [fetchResources, pagination.currentPage, pagination.limit]);

  useEffect(() => {
    setDeletedResources(resources.filter((r) => r.isDeleted));
  }, [resources]);

  const handlePageChange = (newPage: number) => {
    fetchResources({
      includeDeleted: true,
      page: newPage,
      limit: pagination.limit,
    });
  };

  /**========================
   * Handle refresh
   ========================*/
  const handleRefresh = () => {
    fetchResources({
      includeDeleted: true,
      page: pagination.currentPage,
      limit: pagination.limit,
    });
  };

  return (
    <DashboardLayout title="Recycle Bin" token={userData.token}>
      {/*==================== Page Header ====================*/}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Recycle"
          subtitle="Bin"
          description="View and manage deleted resources. Items remain here for 30 days before being permanently removed."
          actions={
            <Link
              href="/admin/resources"
              className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Link>
          }
        />
      </div>
      {/*==================== End of Page Header ====================*/}

      {/*==================== Resource Table ====================*/}
      <ResourceTable
        searchTerm=""
        userRole="admin"
        mode="recycleBin"
        isLoading={isLoading}
        token={userData.token}
        total={pagination.total}
        limit={pagination.limit}
        onRefresh={handleRefresh}
        onClearFilters={() => {}}
        setPage={handlePageChange}
        resources={deletedResources}
        page={pagination.currentPage}
        allResources={deletedResources}
        totalPages={pagination.totalPages}
        onRestoreResource={toggleResourceTrash}
        onDeleteResource={deleteResourcePermanently}
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
