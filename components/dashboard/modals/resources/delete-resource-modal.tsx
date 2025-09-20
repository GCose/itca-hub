import { X, AlertTriangle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeleteResourceModalProps } from '@/types/interfaces/modal';

const DeleteResourceModal = ({
  isOpen,
  onClose,
  onConfirm,
  resourceCount,
  isLoading = false,
  mode = 'permanent',
}: DeleteResourceModalProps) => {
  const isSingleResource = resourceCount === 1;

  const getModalContent = () => {
    switch (mode) {
      case 'restore':
        return {
          title: `Restore ${isSingleResource ? 'Resource' : `${resourceCount} Resources`}`,
          description: `Are you sure you want to restore ${
            isSingleResource ? 'this resource' : `these ${resourceCount} resources`
          }? ${isSingleResource ? 'It' : 'They'} will be moved back to the main resources list.`,
          warningText: isSingleResource
            ? 'This resource will be restored to the main resources list'
            : `${resourceCount} resources will be restored to the main resources list`,
          buttonText: isLoading ? 'Restoring...' : 'Restore',
          buttonColor: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
        };
      case 'permanent':
        return {
          title: `Permanently Delete ${isSingleResource ? 'Resource' : `${resourceCount} Resources`}`,
          description: `Are you sure you want to permanently delete ${
            isSingleResource ? 'this resource' : `these ${resourceCount} resources`
          }? This action cannot be undone.`,
          warningText: isSingleResource
            ? 'This resource will be permanently deleted and cannot be recovered'
            : `${resourceCount} resources will be permanently deleted and cannot be recovered`,
          buttonText: isLoading ? 'Deleting...' : 'Delete Permanently',
          buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        };
      default:
        return {
          title: `Move ${isSingleResource ? 'Resource' : `${resourceCount} Resources`} to Recycle Bin`,
          description: `Are you sure you want to move ${
            isSingleResource ? 'this resource' : `these ${resourceCount} resources`
          } to the recycle bin? ${isSingleResource ? 'It' : 'They'} can be restored later if needed.`,
          warningText: isSingleResource
            ? 'This resource will be moved to the recycle bin'
            : `${resourceCount} resources will be moved to the recycle bin`,
          buttonText: isLoading ? 'Moving...' : 'Move to Recycle Bin',
          buttonColor: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
        };
    }
  };

  const content = getModalContent();

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/*==================== Background Overlay ====================*/}
          <motion.div
            onClick={!isLoading ? onClose : undefined}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          {/*==================== End of Background Overlay ====================*/}

          {/*==================== Modal Content ====================*/}
          <motion.div
            className="relative w-full max-w-md rounded-xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300,
              duration: 0.3,
            }}
          >
            <div className="relative p-6">
              {/*==================== Modal Header ====================*/}
              <div className="mb-5 flex justify-between items-start">
                <div className="flex items-start">
                  <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 leading-6">{content.title}</h3>
                </div>

                <button
                  type="button"
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">{content.description}</p>

                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-sm font-medium text-gray-900 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                    {content.warningText}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {mode === 'permanent'
                      ? 'This action is irreversible'
                      : isSingleResource
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
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`inline-flex justify-center rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 ${content.buttonColor}`}
                  onClick={onConfirm}
                  disabled={isLoading}
                >
                  {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  {content.buttonText}
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
