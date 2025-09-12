import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { apiClient } from '@/utils/api';

interface AdminProfile {
  _id: string;
  firstName: string;
  lastName: string;
  schoolEmail: string;
  role: string;
  isEmailVerified: boolean;
  lastLoggedIn: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UseAdminProfileProps {
  token: string;
}

export const useAdminProfile = ({ token }: UseAdminProfileProps) => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  /**=============================================
   * Fetches the admin's profile from the API
   =============================================*/
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
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

      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      setProfile(data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to load profile', {
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  /**================================
   * Updates the admin's profile
   ================================*/
  const updateProfile = async (payload: UpdateProfilePayload) => {
    setIsUpdatingProfile(true);

    try {
      if (payload.firstName && (payload.firstName.length < 2 || payload.firstName.length > 50)) {
        throw new Error('First name must be between 2-50 characters');
      }
      if (payload.lastName && (payload.lastName.length < 2 || payload.lastName.length > 50)) {
        throw new Error('Last name must be between 2-50 characters');
      }

      const cleanPayload: UpdateProfilePayload = {};
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

      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to update profile');
      }

      setProfile(data.data);
      toast.success('Profile updated successfully', {
        description: 'Your profile information has been updated.',
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile', {
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      throw err;
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  /**==================================
   * Changes the admin's password
   ==================================*/
  const changePassword = async (payload: ChangePasswordPayload) => {
    setIsChangingPassword(true);

    try {
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

      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to change password');
      }

      toast.success('Password changed successfully', {
        description: 'Your password has been updated.',
      });
    } catch (err) {
      console.error('Error changing password:', err);
      toast.error('Failed to change password', {
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      throw err;
    } finally {
      setIsChangingPassword(false);
    }
  };

  /**=========================================
   * Uploads profile image to Jeetix
   =========================================*/
  const uploadProfileImage = async (file: File) => {
    setIsUploadingImage(true);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image file size must be less than 5MB');
      }

      // Upload to Jeetix
      const uploadResponse = await apiClient.uploadToJeetix(file, 'itca-profiles');

      if (uploadResponse.status !== 'success' || !uploadResponse.data?.fileUrl) {
        throw new Error('Failed to upload image');
      }

      // Update profile with new image URL
      await updateProfile({ profilePictureUrl: uploadResponse.data.fileUrl });

      toast.success('Profile picture updated successfully');
      return uploadResponse.data.fileUrl;
    } catch (err) {
      console.error('Error uploading profile image:', err);
      toast.error('Failed to upload profile picture', {
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      throw err;
    } finally {
      setIsUploadingImage(false);
    }
  };

  /**===============================================
   * Fetch profile when component mounts
   ===============================================*/
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
