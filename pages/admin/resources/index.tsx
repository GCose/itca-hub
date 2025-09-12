import { useState, useMemo } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import { UserAuth } from '@/types';
import { isLoggedIn } from '@/utils/auth';
import { NextApiRequest } from 'next';
import { useResources } from '@/hooks/admin/resources/use-resources';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import ResourceTable from '@/components/dashboard/table/resource-table';
import ResourceFilters from '@/components/dashboard/table/resource-table-filters';
import ResourceFilterSkeleton from '@/components/dashboard/table/skeleton/resource-filter-skeleton';
import ResourceTableSkeleton from '@/components/dashboard/table/skeleton/resource-table-skeleton';

interface AdminResourcesPageProps {
  userData: UserAuth;
}

const AdminResourcesPage = ({ userData }: AdminResourcesPageProps) => {
  const {
    resources,
    isLoading,
    isError,
    fetchResources,
    moveToRecycleBin,
    batchMoveToRecycleBin,
    totalPages,
    total,
    setPage,
    page,
    limit,
  } = useResources({ token: userData.token });

  /**===========================
   * Filter state management.
   ===========================*/
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('all');
  const [fileType, setFileType] = useState('all');
  const [category, setCategory] = useState('all');
  const [visibility, setVisibility] = useState('all');

  /**=========================================
   * Generate filter options from resources.
   =========================================*/
  const fileTypes = useMemo(() => {
    return [...new Set(resources.map((resource) => resource.type))].sort();
  }, [resources]);

  const categories = useMemo(() => {
    return [...new Set(resources.map((resource) => resource.category))].sort();
  }, [resources]);

  /**===============================================
   * Filter resources based on current filters.
   ===============================================*/
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = department === 'all' || resource.department === department;
      const matchesType = fileType === 'all' || resource.type === fileType;
      const matchesCategory = category === 'all' || resource.category === category;
      const matchesVisibility = visibility === 'all' || resource.visibility === visibility;

      return (
        matchesSearch && matchesDepartment && matchesType && matchesCategory && matchesVisibility
      );
    });
  }, [resources, searchTerm, department, fileType, category, visibility]);

  /**=====================
   * Clear all filters.
   =====================*/
  const clearFilters = () => {
    setSearchTerm('');
    setDepartment('all');
    setFileType('all');
    setCategory('all');
    setVisibility('all');
  };

  /**=====================================================================================
   * Handles the deletion of a single resource by moving it to the recycle bin.
   * @param resourceId ID of the resource to delete
   * @returns Promise that resolves to true if deletion was successful, false otherwise
   =====================================================================================*/
  const handleDeleteResource = async (resourceId: string): Promise<boolean> => {
    try {
      // Find the resource to get its title
      const resource = resources.find((r) => r.resourceId === resourceId);
      if (!resource) return false;

      // Call the move to recycle bin function
      return await moveToRecycleBin(resourceId, resource.title);
    } catch (err) {
      console.error('Error deleting resource:', err);
      return false;
    }
  };

  /**======================================================================================
   * Handles the deletion of multiple resources by moving them to the recycle bin.
   * @param resourceIds Array of resource IDs to delete
   * @returns Promise that resolves to true if deletion was successful, false otherwise
   ======================================================================================*/
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
          <DashboardPageHeader
            title="Resource"
            subtitle="Management"
            description="Upload and manage educational resources and materials"
            actions={
              <div className="flex flex-col gap-4 w-full md:flex-row sm:mt-0 space-x-3">
                {/*==================== Recycle Bin Button ====================*/}
                <Link
                  href="/admin/resources/recycle-bin"
                  className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Recycle Bin
                </Link>
                {/*==================== End of Recycle Bin Button ====================*/}

                {/*==================== Upload Resource Button ====================*/}
                <Link
                  href="/admin/resources/upload"
                  className="group inline-flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Upload className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-[-2px]" />
                  Upload Resource
                </Link>
                {/*==================== End of Upload Resource Button ====================*/}
              </div>
            }
          />
          {/*==================== End of Page Title Header ====================*/}
        </div>
      </div>

      {/*==================== Page Content ====================*/}
      {isLoading ? (
        <>
          <ResourceFilterSkeleton />
          <ResourceTableSkeleton />
        </>
      ) : (
        <>
          {/*==================== Resource Filters ====================*/}
          <ResourceFilters
            category={category}
            fileType={fileType}
            fileTypes={fileTypes}
            department={department}
            visibility={visibility}
            searchTerm={searchTerm}
            categories={categories}
            setCategory={setCategory}
            setFileType={setFileType}
            clearFilters={clearFilters}
            setDepartment={setDepartment}
            setSearchTerm={setSearchTerm}
            setVisibility={setVisibility}
          />
          {/*==================== End of Resource Filters ====================*/}

          {/*==================== Resource Table ====================*/}
          <ResourceTable
            page={page}
            total={total}
            limit={limit}
            userRole="admin"
            isError={isError}
            isLoading={false}
            setPage={setPage}
            token={userData.token}
            totalPages={totalPages}
            searchTerm={searchTerm}
            allResources={resources}
            onClearFilters={clearFilters}
            resources={filteredResources}
            onDeleteResource={handleDeleteResource}
            onDeleteMultiple={handleDeleteMultiple}
            onRefresh={() => fetchResources({ limit: 10, page: 0 })}
          />
          {/*==================== End of Resource Table ====================*/}
        </>
      )}
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
