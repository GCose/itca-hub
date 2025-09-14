import { AlertTriangle, X, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteEventModal = ({ isOpen, onClose, onConfirm }: DeleteEventModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose, isDeleting]);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/*==================== Background overlay ====================*/}
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={handleClose} />
      {/*==================== End of Background overlay ====================*/}

      {/*==================== Modal content ====================*/}
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl transform transition-all duration-300 scale-100 opacity-100">
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-red-500/10 animate-pulse"></div>
        <div
          className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-amber-500/10 animate-pulse"
          style={{ animationDelay: '0.5s' }}
        ></div>

        <div className="relative p-6">
          <div className="mb-5 flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Delete Event</h3>
            </div>

            <button
              type="button"
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-50"
              onClick={handleClose}
              disabled={isDeleting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <p className="text-sm text-gray-600">
              All associated data, including registrations and resources, will be permanently
              removed.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              onClick={handleClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center items-center rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-medium text-white hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Event'
              )}
            </button>
          </div>
        </div>
      </div>
      {/*==================== End of Modal content ====================*/}
    </div>
  );
};

export default DeleteEventModal;
