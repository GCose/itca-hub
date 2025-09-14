import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';

type ActionType = 'delete' | 'changeRole' | 'toggleEmail' | 'deactivate' | 'reactivate';

interface UseUserActionsProps {
  token: string;
  onUserUpdated: () => void;
}

interface ModalState {
  isOpen: boolean;
  actionType: ActionType;
  userId: string;
  userName: string;
  userRole?: string;
  isLoading: boolean;
}

const useUserActions = ({ token, onUserUpdated }: UseUserActionsProps) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    actionType: 'delete',
    userId: '',
    userName: '',
    userRole: '',
    isLoading: false,
  });

  const openModal = (
    actionType: ActionType,
    userId: string,
    userName: string,
    userRole?: string
  ) => {
    setModalState({
      isOpen: true,
      actionType,
      userId,
      userName,
      userRole,
      isLoading: false,
    });
  };

  const closeModal = () => {
    if (!modalState.isLoading) {
      setModalState((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const executeAction = async () => {
    setModalState((prev) => ({ ...prev, isLoading: true }));

    try {
      let successMessage = '';

      switch (modalState.actionType) {
        case 'delete':
          await axios.delete(`${BASE_URL}/users/${modalState.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          successMessage = `${modalState.userName} has been deleted successfully`;
          break;

        case 'changeRole':
          const newRole = modalState.userRole?.toLowerCase() === 'admin' ? 'USER' : 'ADMIN';
          await axios.patch(
            `${BASE_URL}/users/${modalState.userId}/role`,
            { role: newRole },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          successMessage = `${modalState.userName}'s role has been changed successfully`;
          break;

        case 'toggleEmail':
          await axios.patch(
            `${BASE_URL}/users/${modalState.userId}/toggle-verification`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          successMessage = `${modalState.userName}'s email verification status has been updated`;
          break;

        case 'deactivate':
          await axios.patch(
            `${BASE_URL}/users/${modalState.userId}/deactivate`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          successMessage = `${modalState.userName} has been deactivated successfully`;
          break;

        case 'reactivate':
          await axios.patch(
            `${BASE_URL}/users/${modalState.userId}/reactivate`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          successMessage = `${modalState.userName} has been reactivated successfully`;
          break;

        default:
          throw new Error('Invalid action type');
      }

      toast.success(successMessage, {
        description: 'The user list will be refreshed automatically',
        duration: 4000,
      });

      onUserUpdated();
      closeModal();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || `Failed to ${modalState.actionType} user`
        : `Failed to ${modalState.actionType} user`;

      toast.error('Action Failed', {
        description: errorMessage,
        duration: 5000,
      });

      setModalState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  /**==================== Action Functions ====================*/
  const deleteUser = (userId: string, userName: string) => {
    openModal('delete', userId, userName);
  };

  const toggleEmailVerification = (userId: string, userName: string) => {
    openModal('toggleEmail', userId, userName);
  };

  const deactivateUser = (userId: string, userName: string) => {
    openModal('deactivate', userId, userName);
  };

  const reactivateUser = (userId: string, userName: string) => {
    openModal('reactivate', userId, userName);
  };

  const updateUserRole = (userId: string, userName: string, currentRole: string) => {
    openModal('changeRole', userId, userName, currentRole);
  };

  return {
    deleteUser,
    toggleEmailVerification,
    deactivateUser,
    reactivateUser,
    updateUserRole,
    modalState,
    closeModal,
    executeAction,
  };
};

export default useUserActions;
