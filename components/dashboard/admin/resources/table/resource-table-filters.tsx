import { ResourceFiltersProps } from '@/types';
import { Filter, Building2, FileText, Tag, Eye } from 'lucide-react';

const ResourceFilters = ({
  searchTerm,
  setSearchTerm,
  department,
  setDepartment,
  fileType,
  setFileType,
  category,
  setCategory,
  visibility,
  setVisibility,
  fileTypes,
  categories,
  clearFilters,
}: ResourceFiltersProps) => {
  /**============================================================================================
   * Formats a category string by replacing underscores with spaces and capitalizing each word.
   * @param category - The category string to format.
   * @returns  Formatted category name with spaces and capitalized words.
   ============================================================================================*/
  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="mb-6 bg-white rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filter Resources</h3>
        </div>
        {clearFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/*==================== Search Box ====================*/}
      <div className="mb-4 pt-2">
        <label className="block text-sm font-medium text-gray-500 mb-1">Search</label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-gray-400">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              />
            </svg>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {/*==================== Department Filter ====================*/}
        <div>
          <label className="flex items-center text-sm text-gray-700 mb-2">
            <div className="bg-blue-100/70 p-1 rounded-full mr-2">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            Department
          </label>
          <select
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

        {/*==================== File Type Filter ====================*/}
        <div>
          <label className="flex items-center text-sm text-gray-700 mb-2">
            <div className="bg-green-100/70 p-1 rounded-full mr-2">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            File Type
          </label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
          >
            <option value="all">All File Types</option>
            {fileTypes.map((type) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        {/*==================== End of File Type Filter ====================*/}

        {/*==================== Category Filter ====================*/}
        <div>
          <label className="flex items-center text-sm text-gray-700 mb-2">
            <div className="bg-purple-100/70 p-1 rounded-full mr-2">
              <Tag className="h-5 w-5 text-purple-600" />
            </div>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {formatCategoryName(cat)}
              </option>
            ))}
          </select>
        </div>
        {/*==================== End of Category Filter ====================*/}

        {/*==================== Visibility Filter ====================*/}
        <div>
          <label className="flex items-center text-sm text-gray-700 mb-2">
            <div className="bg-orange-100/70 p-1 rounded-full mr-2">
              <Eye className="h-5 w-5 text-orange-600" />
            </div>
            Visibility
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
          >
            <option value="all">All Users</option>
            <option value="admin">Admin Only</option>
          </select>
        </div>
        {/*==================== End of Visibility Filter ====================*/}
      </div>
      {/*==================== End of Filter Grid ====================*/}
    </div>
  );
};

export default ResourceFilters;
