import Link from 'next/link';
import { UserAuth } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import useResources from '@/hooks/resources/use-resource';
import ResourceTable from '@/components/dashboard/table/resource-table';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import ResourceTableSkeleton from '@/components/dashboard/skeletons/resource-table-skeleton';
import { Upload, Trash2, Bookmark, Filter, Building2, Tag, Eye, Search } from 'lucide-react';
import ResourceFilterSkeleton from '@/components/dashboard/skeletons/resource-filter-skeleton';

interface ResourcesComponentProps {
  role: 'admin' | 'student';
  userData: UserAuth;
}

const ResourcesComponent = ({ role, userData }: ResourcesComponentProps) => {
  const { isError, resources, isLoading, pagination, fetchResources } = useResources({
    token: userData.token,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState<
    'all' | 'computer_science' | 'information_systems' | 'telecommunications'
  >('all');
  const [category, setCategory] = useState('all');
  const [visibility, setVisibility] = useState<'all' | 'admin'>('all');

  const loadResources = useCallback(() => {
    fetchResources({
      page: pagination.currentPage,
      limit: pagination.limit,
      ...(searchTerm.trim() && { search: searchTerm.trim() }),
      ...(department !== 'all' && { department }),
      ...(category !== 'all' && { category }),
      ...(role === 'admin' && visibility !== 'all' && { visibility }),
    });
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
    role,
    fetchResources,
    pagination.limit,
    pagination.currentPage,
  ]);

  const pageConfig = {
    admin: {
      title: 'Resource',
      subtitle: 'Management',
      description: 'Upload, manage, and organize educational materials',
      dashboardTitle: 'Resource Management',
      actions: (
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
      ),
    },
    student: {
      title: 'Resource',
      subtitle: 'Library',
      description: 'Explore and access educational materials for your studies',
      dashboardTitle: 'Resource Library',
      actions: (
        <div className="flex flex-col gap-4 w-full md:flex-row sm:mt-0 space-x-3">
          <Link
            href="/student/resources/bookmarks"
            className="group inline-flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Bookmark className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-[-2px]" />
            Bookmarks
          </Link>
        </div>
      ),
    },
  };

  const config = pageConfig[role];

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
              className={`grid grid-cols-1 ${role === 'admin' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}
            >
              {/*==================== Department Filter ====================*/}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Building2 className="h-4 w-4 inline mr-1" />
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as typeof department)}
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
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Tag className="h-4 w-4 inline mr-1" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
                >
                  <option value="all">All Categories</option>
                  <option value="lecture_note">Lecture Notes</option>
                  <option value="assignment">Assignments</option>
                  <option value="past_papers">Past Papers</option>
                  <option value="tutorial">Tutorials</option>
                  <option value="textbook">Textbooks</option>
                  <option value="research_papers">Research Papers</option>
                </select>
              </div>
              {/*==================== End of Category Filter ====================*/}

              {/*==================== Academic Level Filter ====================*/}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Eye className="h-4 w-4 inline mr-1" />
                  Academic Level
                </label>
                <select
                  value="all"
                  onChange={() => {}} // Will implement when needed
                  className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
                >
                  <option value="all">All Levels</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                </select>
              </div>
              {/*==================== End of Academic Level Filter ====================*/}

              {/*==================== Visibility Filter (Admin Only) ====================*/}
              {role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <Eye className="h-4 w-4 inline mr-1" />
                    Visibility
                  </label>
                  <select
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
            userRole={role === 'admin' ? 'admin' : 'user'}
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
