import { Filter, Building2, Tag, GraduationCap } from 'lucide-react';

interface ResourceFiltersProps {
  department: string;
  setDepartment: (dept: string) => void;
  category: string;
  setCategory: (category: string) => void;
  academicLevel: string;
  setAcademicLevel: (level: string) => void;
  departments: string[];
  categories: string[];
  academicLevels: string[];
}

const ResourceFilters = ({
  department,
  setDepartment,
  category,
  setCategory,
  academicLevel,
  setAcademicLevel,
  departments,
  categories,
  academicLevels,
}: ResourceFiltersProps) => {
  // Format category name for display
  const formatCategory = (category: string) => {
    return category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Format department name for display
  const formatDepartment = (dept: string) => {
    const deptMap: Record<string, string> = {
      'computer-science': 'Computer Science',
      'information-systems': 'Information Systems',
      telecommunications: 'Telecommunications',
    };
    return deptMap[dept] || dept;
  };

  // Format academic level for display
  const formatAcademicLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <div className="mb-6 bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Filter Resources</h3>
      </div>

      {/*==================== Filter Grid ====================*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/*==================== Department Filter ====================*/}
        <div>
          <label className="flex items-center text-sm text-gray-700 mb-2">
            <div className="bg-blue-100 p-1 rounded-full mr-2">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full rounded-lg bg-gray-50 border border-gray-200 py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {formatDepartment(dept)}
              </option>
            ))}
          </select>
        </div>
        {/*==================== End of Department Filter ====================*/}

        {/*==================== Category Filter ====================*/}
        <div>
          <label className="flex items-center text-sm text-gray-700 mb-2">
            <div className="bg-purple-100 p-1 rounded-full mr-2">
              <Tag className="h-4 w-4 text-purple-600" />
            </div>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg bg-gray-50 border border-gray-200 py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {formatCategory(cat)}
              </option>
            ))}
          </select>
        </div>
        {/*==================== End of Category Filter ====================*/}

        {/*==================== Academic Level Filter ====================*/}
        <div>
          <label className="flex items-center text-sm text-gray-700 mb-2">
            <div className="bg-green-100 p-1 rounded-full mr-2">
              <GraduationCap className="h-4 w-4 text-green-600" />
            </div>
            Academic Level
          </label>
          <select
            value={academicLevel}
            onChange={(e) => setAcademicLevel(e.target.value)}
            className="w-full rounded-lg bg-gray-50 border border-gray-200 py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="all">All Levels</option>
            {academicLevels.map((level) => (
              <option key={level} value={level}>
                {formatAcademicLevel(level)}
              </option>
            ))}
          </select>
        </div>
        {/*==================== End of Academic Level Filter ====================*/}
      </div>
      {/*==================== End of Filter Grid ====================*/}
    </div>
  );
};

export default ResourceFilters;
