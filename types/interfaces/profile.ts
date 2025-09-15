import { UserAuth } from '..';

export interface UserProfile {
  _id: string;
  __v: number;
  role: string;
  active: boolean;
  lastName: string;
  firstName: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  schoolEmail: string;
  lastLoggedIn: string;
  isEmailVerified: boolean;
  profilePictureUrl?: string;
}

export interface UpdateProfilePayload {
  lastName?: string;
  firstName?: string;
  profilePictureUrl?: string;
}

export interface ChangePasswordPayload {
  newPassword: string;
  confirmPassword: string;
  currentPassword: string;
}

export interface UseProfileProps {
  token: string;
}

export interface ProfileComponentProps {
  userData: {
    role: string;
    token: string;
    userId: string;
  };
  role: 'admin' | 'student';
}

export interface AdminProfilePageProps {
  userData: UserAuth;
}

export interface StudentProfilePageProps {
  userData: UserAuth;
}
