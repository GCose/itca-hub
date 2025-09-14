import { AlertTriangle, X, Loader } from 'lucide-react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteResourceModalProps {
  resourceCount: number;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteResourceModal = ({
  resourceCount,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteResourceModalProps) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  const isSingleResource = resourceCount === 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/*==================== Background overlay ====================*/}
          <motion.div
            onClick={onClose}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
          />
          {/*==================== End of Background overlay ====================*/}

          {/*==================== Modal Content ====================*/}
          <motion.div
            className="relative w-full max-w-md rounded-xl bg-white shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 1, type: 'spring', damping: 25 }}
          >
            <div className="relative p-6">
              <div className="mb-5 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Move {isSingleResource ? 'Resource' : `${resourceCount} Resources`} to Recycle
                    Bin
                  </h3>
                </div>

                <button
                  type="button"
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  onClick={onClose}
                  disabled={isDeleting}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Are you sure you want to move{' '}
                  {isSingleResource ? 'this resource' : `these ${resourceCount} resources`} to the
                  recycle bin?
                  {isSingleResource ? ' It' : ' They'} can be restored later if needed.
                </p>

                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-sm font-medium text-gray-900 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                    {isSingleResource
                      ? 'This resource will be moved to the recycle bin'
                      : `${resourceCount} resources will be moved to the recycle bin`}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {isSingleResource
                      ? 'The resource will no longer appear in the main resources list'
                      : 'These resources will no longer appear in the main resources list'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2"
                  onClick={onClose}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70"
                  onClick={onConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Moving...
                    </>
                  ) : (
                    'Move to Recycle Bin'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
          {/*==================== End of Modal Content ====================*/}
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteResourceModal;
