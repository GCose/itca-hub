import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, UserPlus, UserMinus, X } from 'lucide-react';
import { RegistrationConfirmationModalProps } from '@/types/interfaces/modal';

const RegistrationConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  eventTitle,
  isRegistered,
  isLoading,
}: RegistrationConfirmationModalProps) => {
  const action = isRegistered ? 'unregister from' : 'register for';
  const buttonColor = isRegistered
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-blue-600 hover:bg-blue-700';
  const Icon = isRegistered ? UserMinus : UserPlus;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/*==================== Background Overlay ====================*/}
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
              damping: 20,
              duration: 0.3,
              type: 'spring',
              stiffness: 300,
            }}
          >
            <div className="p-6">
              {/*==================== Modal Header ====================*/}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Confirm {isRegistered ? 'Unregistration' : 'Registration'}
                  </h3>
                </div>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onClose}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/*==================== End of Modal Header ====================*/}

              {/*==================== Modal Content ====================*/}
              <div className="mb-6">
                <p className="text-md text-gray-600">
                  Are you sure you want to {action}{' '}
                  <span className="font-medium text-gray-900">"{eventTitle}"</span>?
                </p>
              </div>
              {/*==================== End of Modal Content ====================*/}

              {/*==================== Action Buttons ====================*/}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 inline-flex justify-center items-center rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 ${buttonColor}`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isRegistered ? 'Unregistering...' : 'Registering...'}
                    </>
                  ) : (
                    <>
                      <Icon className="h-4 w-4 mr-2" />
                      {isRegistered ? 'Unregister' : 'Register'}
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

export default RegistrationConfirmationModal;
