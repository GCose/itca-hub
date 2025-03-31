import { Filter } from "lucide-react";

interface ResourceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  department: string;
  setDepartment: (dept: string) => void;
  fileType: string;
  setFileType: (type: string) => void;
  status: string;
  setStatus: (status: string) => void;
  visibility: string;
  setVisibility: (visibility: string) => void;
  fileTypes: string[];
  clearFilters?: () => void;
}

const ResourceFilters = ({
  searchTerm,
  setSearchTerm,
  department,
  setDepartment,
  fileType,
  setFileType,
  status,
  setStatus,
  visibility,
  setVisibility,
  fileTypes,
}: ResourceFiltersProps) => {
  return (
    <div className="mb-6 bg-white rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Filter Resources
          </h3>
        </div>
      </div>

      {/*==================== Search Box ====================*/}
      <div className="mb-4 pt-2">
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Search
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-gray-400"
            >
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
            className="w-full rounded-lg bg-white pl-10 pr-4 py-2.5 text-sm text-gray-500 border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-blue-600 transition-colors"
          />
        </div>
      </div>
      {/*==================== End of Search Box ====================*/}

      {/*==================== Filter Grid ====================*/}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {/*==================== Department Filter ====================*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            className="w-full rounded-lg bg-white py-2.5 pl-3 pr-8 text-sm text-gray-500 border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-blue-600 transition-colors"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="computer-science">Computer Science</option>
            <option value="information-systems">Information Systems</option>
            <option value="telecommunications">Telecommunications</option>
          </select>
        </div>
        {/*==================== End of Department Filter ====================*/}

        {/*==================== File Type Filter ====================*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File Type
          </label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full rounded-lg bg-white py-2.5 pl-3 pr-8 text-sm text-gray-500 border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-blue-600 transition-colors"
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

        {/*==================== Status Filter ====================*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg bg-white py-2.5 pl-3 pr-8 text-sm text-gray-500 border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-blue-600 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        {/*==================== End of Status Filter ====================*/}

        {/*==================== Visibility Filter ====================*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Visibility
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full rounded-lg bg-white py-2.5 pl-3 pr-8 text-sm text-gray-500 border border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-blue-600 transition-colors"
          >
            <option value="all">All Visibility</option>
            <option value="students">Students Only</option>
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
