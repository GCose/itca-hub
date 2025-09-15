import { useState, useRef } from 'react';
import { NextApiRequest } from 'next';
import { User, Shield, Calendar, Camera, Lock, Edit3, Save, X, Eye, EyeOff } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import { UserAuth } from '@/types';
import { isLoggedIn } from '@/utils/auth';
import { useStudentProfile } from '@/hooks/student/profile/use-student-profile';
import UserProfileSkeleton from '@/components/dashboard/skeletons/user-profile';

interface StudentProfilePageProps {
  userData: UserAuth;
}

const StudentProfilePage = ({ userData }: StudentProfilePageProps) => {
  const {
    profile,
    isLoading,
    error,
    updateProfile,
    changePassword,
    uploadProfileImage,
    isUpdatingProfile,
    isChangingPassword,
    isUploadingImage,
  } = useStudentProfile({ token: userData.token });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPasswordMode, setIsChangingPasswordMode] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    profilePictureUrl: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  /**=====================================
   * Handle profile edit mode activation
   =====================================*/
  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setProfileForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      profilePictureUrl: profile?.profilePictureUrl || '',
    });
  };

  /**======================
   * Handle profile save
   ======================*/
  const handleProfileSave = async () => {
    try {
      await updateProfile(profileForm);
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  /**=========================
   * Handle password change
   =========================*/
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPasswordMode(false);
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  /**===============================================
   * Handle file selection for profile image
   ===============================================*/
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadProfileImage(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**=============================
   * Toggle password visibility
   =============================*/
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  /**======================
   * Format date helper
   ======================*/
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**===========================
   * Format last login helper
   ===========================*/
  const formatLastLogin = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout title="My Profile" token={userData.token}>
        <UserProfileSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="My Profile" token={userData.token}>
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-red-500 mb-4">Failed to load profile</div>
          <p className="text-gray-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Profile" token={userData.token}>
      {/*==================== Page Header ====================*/}
      <DashboardPageHeader
        title="My"
        subtitle="Profile"
        description="Manage your account settings and personal information"
      />
      {/*==================== End of Page Header ====================*/}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/*==================== Profile Information Card ====================*/}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                Profile Information
              </h2>
              {!isEditingProfile && (
                <button
                  onClick={handleProfileEdit}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {!isEditingProfile ? (
              /*==================== Display Mode ====================*/
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {profile?.profilePictureUrl ? (
                      <img
                        src={profile.profilePictureUrl}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                        <User className="w-8 h-8 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {profile?.firstName} {profile?.lastName}
                    </h3>
                    <p className="text-gray-500">{profile?.schoolEmail}</p>
                    <div className="flex items-center mt-1">
                      {profile?.isEmailVerified ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      FIRST NAME
                    </label>
                    <p className="text-gray-900 font-medium">{profile?.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      LAST NAME
                    </label>
                    <p className="text-gray-900 font-medium">{profile?.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">EMAIL</label>
                    <p className="text-gray-900 font-medium">{profile?.schoolEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">ROLE</label>
                    <p className="text-gray-900 font-medium capitalize">
                      {profile?.role.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /*==================== End of Display Mode ====================*/

              /*==================== Edit Mode ====================*/
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {profileForm.profilePictureUrl || profile?.profilePictureUrl ? (
                      <img
                        src={profileForm.profilePictureUrl || profile?.profilePictureUrl}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                        <User className="w-8 h-8 text-blue-600" />
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isUploadingImage ? (
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera className="w-3 h-3" />
                      )}
                    </button>
                    <input
                      title="Input"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Profile Picture</h3>
                    <p className="text-sm text-gray-500">
                      Click the camera icon to upload a new photo
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, firstName: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    disabled={isUpdatingProfile}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
              /*==================== End of Edit Mode ====================*/
            )}
          </div>

          {/*==================== Password Change Card ====================*/}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Lock className="h-5 w-5 text-blue-600 mr-2" />
                Password & Security
              </h2>
              {!isChangingPasswordMode && (
                <button
                  onClick={() => setIsChangingPasswordMode(true)}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </button>
              )}
            </div>

            {!isChangingPasswordMode ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Keep your account secure by using a strong password.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Password Requirements:</strong> At least 6 characters with uppercase,
                    lowercase, number, and special character.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="currentPassword"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-200 p-2.5 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-200 p-2.5 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-200 p-2.5 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setIsChangingPasswordMode(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setShowPasswords({ current: false, new: false, confirm: false });
                    }}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    disabled={
                      isChangingPassword ||
                      !passwordForm.currentPassword ||
                      !passwordForm.newPassword ||
                      passwordForm.newPassword !== passwordForm.confirmPassword
                    }
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/*==================== End of Profile Information Card ====================*/}

        {/*==================== Account Summary Card ====================*/}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              Account Summary
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                <p className="text-gray-900 font-medium">
                  {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
                <p className="text-gray-900 font-medium">
                  {profile?.lastLoggedIn ? formatLastLogin(profile.lastLoggedIn) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Status</label>
                <div className="flex items-center">
                  {profile?.isEmailVerified ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*==================== End of Account Summary Card ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default StudentProfilePage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const userData = isLoggedIn(req);

  if (userData === false) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  const userAuth = userData as UserAuth;

  if (userAuth.role === 'admin') {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userData,
    },
  };
};
