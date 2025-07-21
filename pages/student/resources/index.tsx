import { useEffect, useState, useMemo } from 'react';
import { Bookmark } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import { UserAuth } from '@/types';
import { isLoggedIn } from '@/utils/auth';
import { NextApiRequest } from 'next';
import { useStudentResources } from '@/hooks/student/resources/use-student-resources';
import ResourceTable from '@/components/dashboard/table/resource-table';
import ResourceFilters from '@/components/dashboard/table/resource-table-filters';
import ResourceFilterSkeleton from '@/components/dashboard/table/skeleton/resource-filter-skeleton';
import ResourceTableSkeleton from '@/components/dashboard/table/skeleton/resource-table-skeleton';

interface StudentResourcesPageProps {
  userData: UserAuth;
}

const StudentResourcesPage = ({ userData }: StudentResourcesPageProps) => {
  const { resources, isLoading, isError, fetchResources } = useStudentResources({
    token: userData.token,
  });

  /**===========================
   * Filter state management.
   ===========================*/
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('all');
  const [fileType, setFileType] = useState('all');
  const [category, setCategory] = useState('all');

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

      return matchesSearch && matchesDepartment && matchesType && matchesCategory;
    });
  }, [resources, searchTerm, department, fileType, category]);

  /**=====================
   * Clear all filters.
   =====================*/
  const clearFilters = () => {
    setSearchTerm('');
    setDepartment('all');
    setFileType('all');
    setCategory('all');
  };

  /**===============================================
   * Fetches resources when the component mounts.
   ===============================================*/
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return (
    <DashboardLayout title="Resource Library">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/*==================== Page Title Header ====================*/}
          <DashboardPageHeader
            title="Resource"
            subtitle="Library"
            description="Explore and access educational materials for your studies"
            actions={
              <div className="flex flex-col gap-4 w-full md:flex-row sm:mt-0 space-x-3">
                {/*==================== Bookmarks Button ====================*/}
                <Link
                  href="/student/resources/bookmarks"
                  className="group inline-flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Bookmark className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-[-2px]" />
                  Bookmarks
                </Link>
                {/*==================== End of Bookmarks Button ====================*/}
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
            searchTerm={searchTerm}
            categories={categories}
            setCategory={setCategory}
            setFileType={setFileType}
            clearFilters={clearFilters}
            setDepartment={setDepartment}
            setSearchTerm={setSearchTerm}
          />
          {/*==================== End of Resource Filters ====================*/}

          {/*==================== Resource Table ====================*/}
          <ResourceTable
            isError={isError}
            isLoading={false}
            token={userData.token}
            userRole="user"
            searchTerm={searchTerm}
            allResources={resources}
            resources={filteredResources}
            onClearFilters={clearFilters}
            onRefresh={() => fetchResources()}
          />
          {/*==================== End of Resource Table ====================*/}
        </>
      )}
      {/*==================== End of Page Content ====================*/}
    </DashboardLayout>
  );
};

export default StudentResourcesPage;

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

  if (userAuth.role === 'admin') {
    return {
      redirect: {
        destination: '/admin',
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
