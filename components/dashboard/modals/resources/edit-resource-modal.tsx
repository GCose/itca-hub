import { X, Save, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Resource } from '@/types/interfaces/resource';
import { ResourceEditModalProps } from '@/types/interfaces/modal';

const ResourceEditModal = ({
  isOpen,
  resource,
  onClose,
  onSave,
  isLoading = false,
}: ResourceEditModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState<'all' | 'admin'>('all');
  const [academicLevel, setAcademicLevel] = useState<'undergraduate' | 'postgraduate' | 'all'>(
    'all'
  );
  const [department, setDepartment] = useState<
    'computer_science' | 'information_systems' | 'telecommunications' | 'all'
  >('all');

  const categories = [
    'lecture_note',
    'assignment',
    'past_papers',
    'tutorial',
    'textbook',
    'research_papers',
  ];

  const departments = ['computer_science', 'information_systems', 'telecommunications', 'all'];

  useEffect(() => {
    if (resource) {
      setTitle(resource.title || '');
      setDescription(resource.description || '');
      setCategory(resource.category || '');
      setVisibility(resource.visibility || 'all');
      setAcademicLevel(resource.academicLevel || 'all');
      setDepartment(resource.department || 'all');
    }
  }, [resource]);

  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDepartmentName = (dept: string) => {
    return dept.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    const updatedResource: Partial<Resource> = {
      title: title.trim(),
      description: description.trim(),
      category,
      visibility,
      academicLevel,
      department,
    };

    try {
      await onSave(updatedResource);
      onClose();
    } 
  };

  if (!resource) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            onClick={!isLoading ? onClose : undefined}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              {/*==================== Modal Header ====================*/}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    Edit Resource
                    <span className="ml-2 relative">
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </span>
                    </span>
                  </h3>
                </div>

                <button
                  type="button"
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-50"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/*==================== End of Modal Header ====================*/}

              {/*==================== Form Content ====================*/}
              <div className="mb-6 space-y-4">
                {/*==================== Title ====================*/}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                {/*==================== End of Title ====================*/}

                {/*==================== Description ====================*/}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                {/*==================== End of Description ====================*/}

                {/*==================== Category and Department Row ====================*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/*==================== Category ====================*/}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {formatCategoryName(cat)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/*==================== End of Category ====================*/}

                  {/*==================== Department ====================*/}
                  <div>
                    <label
                      htmlFor="department"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Department
                    </label>
                    <select
                      id="department"
                      value={department}
                      onChange={(e) =>
                        setDepartment(
                          e.target.value as
                            | 'computer_science'
                            | 'information_systems'
                            | 'telecommunications'
                            | 'all'
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {formatDepartmentName(dept)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/*==================== End of Department ====================*/}
                </div>
                {/*==================== End of Category and Department Row ====================*/}

                {/*==================== Visibility and Academic Level Row ====================*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/*==================== Visibility ====================*/}
                  <div>
                    <label
                      htmlFor="visibility"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Visibility
                    </label>
                    <select
                      id="visibility"
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value as 'all' | 'admin')}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    >
                      <option value="all">All Users</option>
                      <option value="admin">Admin Only</option>
                    </select>
                  </div>
                  {/*==================== End of Visibility ====================*/}

                  {/*==================== Academic Level ====================*/}
                  <div>
                    <label
                      htmlFor="academicLevel"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Academic Level
                    </label>
                    <select
                      id="academicLevel"
                      value={academicLevel}
                      onChange={(e) =>
                        setAcademicLevel(e.target.value as 'undergraduate' | 'postgraduate' | 'all')
                      }
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    >
                      <option value="all">All Levels</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="postgraduate">Postgraduate</option>
                    </select>
                  </div>
                  {/*==================== End of Academic Level ====================*/}
                </div>
                {/*==================== End of Visibility and Academic Level Row ====================*/}
              </div>
              {/*==================== End of Form Content ====================*/}

              {/*==================== Action Buttons ====================*/}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading || !title.trim()}
                  className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
              {/*==================== End of Action Buttons ====================*/}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResourceEditModal;
