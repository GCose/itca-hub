import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';

interface UseAdminProfileProps {
  token: string;
}

interface AdminProfile {
  _id: string;
  firstName: string;
  lastName: string;
  schoolEmail: string;
  role: string;
  isEmailVerified: boolean;
  lastLoggedIn?: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useAdminProfile = ({ token }: UseAdminProfileProps) => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  /*==================== Fetch Profile ====================*/
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        setProfile(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      toast.error('Failed to load profile', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  /*==================== End of Fetch Profile ====================*/

  /*==================== Update Profile ====================*/
  const updateProfile = useCallback(
    async (payload: ProfileUpdateData) => {
      try {
        setIsUpdatingProfile(true);

        // Input validation
        if (payload.firstName && (payload.firstName.length < 2 || payload.firstName.length > 50)) {
          throw new Error('First name must be between 2-50 characters');
        }
        if (payload.lastName && (payload.lastName.length < 2 || payload.lastName.length > 50)) {
          throw new Error('Last name must be between 2-50 characters');
        }

        // Clean payload - only send non-empty fields
        const cleanPayload: ProfileUpdateData = {};
        if (payload.firstName?.trim()) cleanPayload.firstName = payload.firstName.trim();
        if (payload.lastName?.trim()) cleanPayload.lastName = payload.lastName.trim();
        if (payload.profilePictureUrl?.trim())
          cleanPayload.profilePictureUrl = payload.profilePictureUrl.trim();

        const response = await fetch(`${BASE_URL}/users/profile`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanPayload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `Failed to update profile: ${response.statusText}`);
        }

        if (data.status === 'success') {
          setProfile(data.data);
          toast.success('Profile updated successfully', {
            description: 'Your profile information has been updated.',
          });
        } else {
          throw new Error(data.message || 'Failed to update profile');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
        toast.error('Failed to update profile', {
          description: errorMessage,
        });
        throw err;
      } finally {
        setIsUpdatingProfile(false);
      }
    },
    [token]
  );
  /*==================== End of Update Profile ====================*/

  /*==================== Change Password ====================*/
  const changePassword = useCallback(
    async (payload: PasswordChangeData) => {
      try {
        setIsChangingPassword(true);

        // Password validation
        if (payload.newPassword.length < 6 || payload.newPassword.length > 128) {
          throw new Error('Password must be between 6-128 characters');
        }

        const hasUppercase = /[A-Z]/.test(payload.newPassword);
        const hasLowercase = /[a-z]/.test(payload.newPassword);
        const hasNumber = /\d/.test(payload.newPassword);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(payload.newPassword);

        if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
          throw new Error(
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
          );
        }

        if (payload.newPassword !== payload.confirmPassword) {
          throw new Error('New password and confirmation password do not match');
        }

        const response = await fetch(`${BASE_URL}/users/change-password`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword: payload.currentPassword,
            newPassword: payload.newPassword,
            confirmPassword: payload.confirmPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `Failed to change password: ${response.statusText}`);
        }

        if (data.status === 'success') {
          toast.success('Password changed successfully', {
            description: 'Your password has been updated.',
          });
        } else {
          throw new Error(data.message || 'Failed to change password');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
        toast.error('Failed to change password', {
          description: errorMessage,
        });
        throw err;
      } finally {
        setIsChangingPassword(false);
      }
    },
    [token]
  );
  /*==================== End of Change Password ====================*/

  /*==================== Upload Profile Image ====================*/
  const uploadProfileImage = useCallback(
    async (file: File) => {
      try {
        setIsUploadingImage(true);

        // File validation
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error('Please upload a valid image file (JPEG, JPG, PNG, or GIF)');
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          throw new Error('File size must be less than 5MB');
        }

        // Upload to Jeetix file service
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch(
          'https://jeetix-file-service.onrender.com/api/storage/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();

        if (uploadData.status === 'success') {
          const profilePictureUrl = uploadData.data.fileUrl;

          // Update profile with new image URL
          await updateProfile({ profilePictureUrl });

          toast.success('Profile picture updated successfully');
        } else {
          throw new Error(uploadData.message || 'Failed to upload image');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
        toast.error('Failed to upload profile picture', {
          description: errorMessage,
        });
        throw err;
      } finally {
        setIsUploadingImage(false);
      }
    },
    [updateProfile]
  );
  /*==================== End of Upload Profile Image ====================*/

  /*==================== Fetch Profile on Mount ====================*/
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  /*==================== End of Fetch Profile on Mount ====================*/

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    changePassword,
    uploadProfileImage,
    isUpdatingProfile,
    isChangingPassword,
    isUploadingImage,
    refetchProfile: fetchProfile,
  };
};
