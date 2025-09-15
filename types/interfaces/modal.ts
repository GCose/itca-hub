import { ActionType, CreateEventData } from '..';
import { EventProps } from './event';

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

export interface EditEventModalProps {
  isOpen: boolean;
  event: EventProps | null;
  onClose: () => void;
  onSave: (eventId: string, eventData: CreateEventData) => Promise<void>;
}
