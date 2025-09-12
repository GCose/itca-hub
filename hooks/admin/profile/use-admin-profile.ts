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
    async (updateData: ProfileUpdateData) => {
      try {
        setIsUpdatingProfile(true);

        const response = await fetch(`${BASE_URL}/users/profile`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error(`Failed to update profile: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status === 'success') {
          setProfile(data.data);
          toast.success('Profile updated successfully');
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
    async (passwordData: PasswordChangeData) => {
      try {
        setIsChangingPassword(true);

        const response = await fetch(`${BASE_URL}/users/change-password`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(passwordData),
        });

        if (!response.ok) {
          throw new Error(`Failed to change password: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status === 'success') {
          toast.success('Password changed successfully');
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
