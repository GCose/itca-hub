import { useState } from "react";
import { X, Pencil, Save, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Resource } from "@/hooks/admin/use-resources";

interface ResourceEditModalProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedResource: Resource) => Promise<void>;
}

const ResourceEditModal = ({
  resource,
  isOpen,
  onClose,
  onSave,
}: ResourceEditModalProps) => {
  const [title, setTitle] = useState(resource.title);
  const [description, setDescription] = useState(resource.description);
  const [department, setDepartment] = useState(resource.department || "");
  const [visibility, setVisibility] = useState(resource.visibility);
  const [status, setStatus] = useState(resource.status);
  const [isSaving, setIsSaving] = useState(false);

  // Handle save
  const handleSave = async () => {
    if (!title.trim()) {
      return; // Don't save if title is empty
    }

    setIsSaving(true);
    try {
      // Create updated resource object
      const updatedResource = {
        ...resource,
        title,
        description,
        department,
        visibility: visibility as "students" | "admin",
        status: status as "active" | "archived",
      };

      await onSave(updatedResource);
      onClose();
    } catch (error) {
      console.error("Failed to save resource:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/*==================== Background Overlay ====================*/}
          <motion.div
            onClick={!isSaving ? onClose : undefined}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          {/*==================== End of Background Overlay ====================*/}

          {/*==================== Modal Content ====================*/}
          <motion.div
            className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              duration: 0.3,
            }}
          >
            <div className="relative p-6">
              {/*==================== Modal Header ====================*/}
              <div className="mb-5 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Pencil className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium flex items-center">
                    <span className="text-blue-700 mr-2">Edit</span>
                    <span className="text-amber-500">Resource</span>
                    <span className="ml-3 relative">
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
                  disabled={isSaving}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/*==================== End of Modal Header ====================*/}

              {/*==================== Form Content ====================*/}
              <div className="mb-6">
                {/*==================== Title ====================*/}
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    rows={3}
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                {/*==================== End of Description ====================*/}

                {/*==================== Department and Visibility Container ====================*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/*==================== Department ====================*/}
                  <div>
                    <label
                      htmlFor="department"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      <option value="computer-science">Computer Science</option>
                      <option value="information-systems">
                        Information Systems
                      </option>
                      <option value="telecommunications">
                        Telecommunications
                      </option>
                    </select>
                  </div>
                  {/*==================== End of Department ====================*/}

                  {/*==================== Visibility ====================*/}
                  <div>
                    <label
                      htmlFor="visibility"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Visibility <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="visibility"
                      value={visibility}
                      onChange={(e) =>
                        setVisibility(e.target.value as "students" | "admin")
                      }
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      required
                    >
                      <option value="students">Students Only</option>
                      <option value="admin">Admin Only</option>
                    </select>
                  </div>
                  {/*==================== End of Visibility ====================*/}
                </div>
                {/*==================== End of Department and Visibility Container ====================*/}

                {/*==================== Status ====================*/}
                <div className="mb-4">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "active" | "archived")
                    }
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                {/*==================== End of Status ====================*/}
              </div>
              {/*==================== End of Form Content ====================*/}

              {/*==================== Action Buttons ====================*/}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !title.trim() || !department}
                  className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSaving ? (
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
          {/*==================== End of Modal Content ====================*/}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResourceEditModal;
