import axios from 'axios';
import { toast } from 'sonner';
import { useState } from 'react';
import { BASE_URL } from '@/utils/url';
import { ModalState } from '@/types/interfaces/modal';
import { ActionType, UseUserActionsProps } from '@/types';

const useUserActions = ({ token, onUserUpdated }: UseUserActionsProps) => {
  const [modalState, setModalState] = useState<ModalState>({
    userId: '',
    userName: '',
    userRole: '',
    isOpen: false,
    isLoading: false,
    actionType: 'delete',
  });

  const openModal = (
    actionType: ActionType,
    userId: string,
    userName: string,
    userRole?: string
  ) => {
    setModalState({
      userId,
      userName,
      userRole,
      actionType,
      isOpen: true,
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
          const newRole = modalState.userRole?.toLowerCase() === 'admin' ? 'user' : 'admin';
          await axios.patch(
            `${BASE_URL}/users/${modalState.userId}/role`,
            { role: newRole },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          successMessage = `${modalState.userName}'s role has been changed successfully`;
          break;

        case 'toggleActivation':
          await axios.patch(
            `${BASE_URL}/users/${modalState.userId}/toggle-activation`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          successMessage = `${modalState.userName}'s activation status has been updated successfully`;
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

  const deleteUser = (userId: string, userName: string) => {
    openModal('delete', userId, userName);
  };

  const toggleUserActivation = (userId: string, userName: string) => {
    openModal('toggleActivation', userId, userName);
  };

  const updateUserRole = (userId: string, userName: string, currentRole: string) => {
    openModal('changeRole', userId, userName, currentRole);
  };

  return {
    deleteUser,
    modalState,
    closeModal,
    executeAction,
    updateUserRole,
    toggleUserActivation,
  };
};

export default useUserActions;
