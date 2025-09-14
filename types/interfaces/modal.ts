import { ActionType } from '..';

export interface ModalState {
  userId: string;
  isOpen: boolean;
  userName: string;
  userRole?: string;
  isLoading: boolean;
  actionType: ActionType;
}

export type UserActionModalType = 'delete' | 'changeRole' | 'toggleActivation';

export interface UserActionsModalProps {
  isOpen: boolean;
  userName: string;
  userRole?: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: UserActionModalType;
}
