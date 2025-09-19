import { useState, useEffect, useCallback } from 'react';
import { Upload, Trash2, Bookmark, Filter, Building2, Tag, Eye, Search } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import { UserAuth } from '@/types';
import useResources from '@/hooks/resources/use-resource';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import ResourceTable from '@/components/dashboard/table/resource-table';
import ResourceFilterSkeleton from '@/components/dashboard/skeletons/resource-filter-skeleton';
import ResourceTableSkeleton from '@/components/dashboard/skeletons/resource-table-skeleton';

interface ResourcesComponentProps {
  role: 'admin' | 'student';
  userData: UserAuth;
}

const ResourcesComponent = ({ role, userData }: ResourcesComponentProps) => {
  const { isError, resources, isLoading, pagination, fetchResources } = useResources({
    token: userData.token,
  });

  {
    /*==================== Filter State Management ====================*/
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('all');
  const [category, setCategory] = useState('all');
  const [visibility, setVisibility] = useState<'all' | 'admin'>('all');
  {
    /*==================== End of Filter State Management ====================*/
  }

  {
    /*==================== Load Resources ====================*/
  }
  const loadResources = useCallback(() => {
    const filterParams = {
      page: pagination.currentPage,
      limit: pagination.limit,
      ...(searchTerm.trim() && { search: searchTerm.trim() }),
      ...(department !== 'all' && { department }),
      ...(category !== 'all' && { category }),
      ...(role === 'admin' && visibility !== 'all' && { visibility }),
    };

    fetchResources(filterParams);
  }, [
    fetchResources,
    searchTerm,
    department,
    category,
    visibility,
    pagination.currentPage,
    pagination.limit,
    role,
  ]);
  {
    /*==================== End of Load Resources ====================*/
  }

  {
    /*==================== Handle Page Change ====================*/
  }
  const handlePageChange = (newPage: number) => {
    fetchResources({
      page: newPage,
      limit: pagination.limit,
      ...(searchTerm.trim() && { search: searchTerm.trim() }),
      ...(department !== 'all' && { department }),
      ...(category !== 'all' && { category }),
      ...(role === 'admin' && visibility !== 'all' && { visibility }),
    });
  };
  {
    /*==================== End of Handle Page Change ====================*/
  }

  {
    /*==================== Clear All Filters ====================*/
  }
  const clearFilters = () => {
    setSearchTerm('');
    setDepartment('all');
    setCategory('all');
    setVisibility('all');
  };

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  useEffect(() => {
    // Reset to first page when filters change
    if (pagination.currentPage !== 0) {
      fetchResources({
        page: 0,
        limit: pagination.limit,
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
        ...(department !== 'all' && { department }),
        ...(category !== 'all' && { category }),
        ...(role === 'admin' && visibility !== 'all' && { visibility }),
      });
    }
  }, [
    searchTerm,
    department,
    category,
    visibility,
    fetchResources,
    pagination.limit,
    pagination.currentPage,
    role,
  ]);
  {
    /*==================== End of Effects ====================*/
  }

  {
    /*==================== Role-Specific Configuration ====================*/
  }
  const pageConfig = {
    admin: {
      title: 'Resource',
      subtitle: 'Management',
      description: 'Upload, manage, and organize educational materials',
      dashboardTitle: 'Resource Management',
      actions: (
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/resources/upload"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Resource
          </Link>
          <Link
            href="/admin/resources/recycle-bin"
            className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Recycle Bin
          </Link>
        </div>
      ),
    },
    student: {
      title: 'Resource',
      subtitle: 'Library',
      description: 'Explore and access educational materials for your studies',
      dashboardTitle: 'Resource Library',
      actions: (
        <Link
          href="/student/resources/bookmarks"
          className="group inline-flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Bookmark className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-[-2px]" />
          Bookmarks
        </Link>
      ),
    },
  };

  const config = pageConfig[role];
  {
    /*==================== End of Role-Specific Configuration ====================*/
  }

  return (
    <DashboardLayout title={config.dashboardTitle} token={userData.token}>
      {/*==================== Page Header ====================*/}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title={config.title}
          subtitle={config.subtitle}
          description={config.description}
          actions={config.actions}
        />
      </div>
      {/*==================== End of Page Header ====================*/}

      {/*==================== Page Content ====================*/}
      {isLoading ? (
        <>
          <ResourceFilterSkeleton />
          <ResourceTableSkeleton />
        </>
      ) : (
        <>
          {/*==================== Resource Filters ====================*/}
          <div className="mb-6 bg-white rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Filter Resources</h3>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>

            {/*==================== Search Box ====================*/}
            <div className="mb-4 pt-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Search</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resources by title or description..."
                  className="w-full rounded-lg bg-gray-100/70 pl-10 pr-4 py-2.5 text-sm text-gray-500 focus:bg-slate-200/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
            {/*==================== End of Search Box ====================*/}

            {/*==================== Filter Grid ====================*/}
            <div
              className={`grid grid-cols-1 ${role === 'admin' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 pt-2`}
            >
              {/*==================== Department Filter ====================*/}
              <div>
                <label className="flex items-center text-sm text-gray-700 mb-2">
                  <div className="bg-blue-100/70 p-1 rounded-full mr-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  Department
                </label>
                <select
                  title="Select Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
                >
                  <option value="all">All Departments</option>
                  <option value="computer_science">Computer Science</option>
                  <option value="information_systems">Information Systems</option>
                  <option value="telecommunications">Telecommunications</option>
                </select>
              </div>
              {/*==================== End of Department Filter ====================*/}

              {/*==================== Category Filter ====================*/}
              <div>
                <label className="flex items-center text-sm text-gray-700 mb-2">
                  <div className="bg-purple-100/70 p-1 rounded-full mr-2">
                    <Tag className="h-5 w-5 text-purple-600" />
                  </div>
                  Category
                </label>
                <select
                  title="Select Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
                >
                  <option value="all">All Categories</option>
                  <option value="lecture_note">Lecture Note</option>
                  <option value="assignment">Assignment</option>
                  <option value="past_papers">Past Papers</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="textbook">Textbook</option>
                  <option value="research_paper">Research Paper</option>
                </select>
              </div>
              {/*==================== End of Category Filter ====================*/}

              {/*==================== Visibility Filter (Admin Only) ====================*/}
              {role === 'admin' && (
                <div>
                  <label className="flex items-center text-sm text-gray-700 mb-2">
                    <div className="bg-amber-100/70 p-1 rounded-full mr-2">
                      <Eye className="h-5 w-5 text-amber-600" />
                    </div>
                    Visibility
                  </label>
                  <select
                    title="Select Visibility"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as 'all' | 'admin')}
                    className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
                  >
                    <option value="all">All Resources</option>
                    <option value="admin">Admin Only</option>
                  </select>
                </div>
              )}
              {/*==================== End of Visibility Filter ====================*/}
            </div>
            {/*==================== End of Filter Grid ====================*/}
          </div>
          {/*==================== End of Resource Filters ====================*/}

          {/*==================== Resource Table ====================*/}
          <ResourceTable
            userRole={role}
            isError={isError}
            isLoading={false}
            resources={resources}
            token={userData.token}
            searchTerm={searchTerm}
            total={pagination.total}
            limit={pagination.limit}
            allResources={resources}
            onRefresh={loadResources}
            setPage={handlePageChange}
            page={pagination.currentPage}
            onClearFilters={clearFilters}
            totalPages={pagination.totalPages}
          />
          {/*==================== End of Resource Table ====================*/}
        </>
      )}
      {/*==================== End of Page Content ====================*/}
    </DashboardLayout>
  );
};

export default ResourcesComponent;
