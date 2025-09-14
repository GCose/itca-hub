import { AlertTriangle, X, Loader, Crown, Mail, UserX } from 'lucide-react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ActionType = 'delete' | 'changeRole' | 'toggleEmail' | 'deactivate' | 'reactivate';

interface UserActionsModalProps {
  isOpen: boolean;
  isLoading: boolean;
  actionType: ActionType;
  userName: string;
  userRole?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const UserActionsModal = ({
  isOpen,
  isLoading,
  actionType,
  userName,
  userRole,
  onClose,
  onConfirm,
}: UserActionsModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, isLoading]);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const getModalContent = () => {
    switch (actionType) {
      case 'delete':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
          iconBg: 'bg-red-100',
          title: 'Delete User',
          description: `Are you sure you want to delete ${userName}? This action cannot be undone and will permanently remove all user data.`,
          confirmText: isLoading ? 'Deleting...' : 'Delete User',
          confirmClass:
            'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600',
        };
      case 'changeRole':
        const newRole = userRole?.toLowerCase() === 'admin' ? 'Student' : 'Admin';
        return {
          icon: <Crown className="h-5 w-5 text-blue-600" />,
          iconBg: 'bg-blue-100',
          title: 'Change User Role',
          description: `Are you sure you want to change ${userName}'s role to ${newRole}?`,
          confirmText: isLoading ? 'Changing...' : `Make ${newRole}`,
          confirmClass:
            'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600',
        };
      case 'toggleEmail':
        return {
          icon: <Mail className="h-5 w-5 text-amber-600" />,
          iconBg: 'bg-amber-100',
          title: 'Toggle Email Verification',
          description: `Are you sure you want to toggle ${userName}'s email verification status?`,
          confirmText: isLoading ? 'Updating...' : 'Update Status',
          confirmClass:
            'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600',
        };
      case 'deactivate':
        return {
          icon: <UserX className="h-5 w-5 text-orange-600" />,
          iconBg: 'bg-orange-100',
          title: 'Deactivate User',
          description: `Are you sure you want to deactivate ${userName}? They will not be able to access their account.`,
          confirmText: isLoading ? 'Deactivating...' : 'Deactivate User',
          confirmClass:
            'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600',
        };
      case 'reactivate':
        return {
          icon: <UserX className="h-5 w-5 text-green-600" />,
          iconBg: 'bg-green-100',
          title: 'Reactivate User',
          description: `Are you sure you want to reactivate ${userName}? They will regain access to their account.`,
          confirmText: isLoading ? 'Reactivating...' : 'Reactivate User',
          confirmClass:
            'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600',
        };
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5 text-gray-600" />,
          iconBg: 'bg-gray-100',
          title: 'Confirm Action',
          description: 'Are you sure you want to perform this action?',
          confirmText: isLoading ? 'Processing...' : 'Confirm',
          confirmClass:
            'bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600',
        };
    }
  };

  const { icon, iconBg, title, description, confirmText, confirmClass } = getModalContent();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            onClick={handleClose}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

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
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-blue-500/10 animate-pulse"></div>
            <div
              className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-amber-500/10 animate-pulse"
              style={{ animationDelay: '0.5s' }}
            ></div>

            <div className="relative p-6">
              <div className="mb-5 flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className={`mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${iconBg}`}
                  >
                    {icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                </div>

                <button
                  type="button"
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-50"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600">{description}</p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`inline-flex justify-center items-center rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 ${confirmClass}`}
                  onClick={onConfirm}
                  disabled={isLoading}
                >
                  {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserActionsModal;
