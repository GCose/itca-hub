import { useState, useRef } from 'react';
import { NextApiRequest } from 'next';
import {
  User,
  Shield,
  Calendar,
  Camera,
  Lock,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Crown,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import { UserAuth } from '@/types';
import { isLoggedIn } from '@/utils/auth';
import { useAdminProfile } from '@/hooks/admin/profile/use-admin-profile';
import UserProfileSkeleton from '@/components/dashboard/student/skeleton/user-profile';

interface AdminProfilePageProps {
  userData: UserAuth;
}

const AdminProfilePage = ({ userData }: AdminProfilePageProps) => {
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
  } = useAdminProfile({ token: userData.token });

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

  /*==================== Handle Profile Edit ====================*/
  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setProfileForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      profilePictureUrl: profile?.profilePictureUrl || '',
    });
  };
  /*==================== End of Handle Profile Edit ====================*/

  /*==================== Handle Profile Save ====================*/
  const handleProfileSave = async () => {
    try {
      await updateProfile(profileForm);
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };
  /*==================== End of Handle Profile Save ====================*/

  /*==================== Handle Profile Cancel ====================*/
  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setProfileForm({
      firstName: '',
      lastName: '',
      profilePictureUrl: '',
    });
  };
  /*==================== End of Handle Profile Cancel ====================*/

  /*==================== Handle Password Save ====================*/
  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await changePassword(passwordForm);
      setIsChangingPasswordMode(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };
  /*==================== End of Handle Password Save ====================*/

  /*==================== Handle Password Cancel ====================*/
  const handlePasswordCancel = () => {
    setIsChangingPasswordMode(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  /*==================== End of Handle Password Cancel ====================*/

  /*==================== Handle Profile Picture Upload ====================*/
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadProfileImage(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  /*==================== End of Handle Profile Picture Upload ====================*/

  /*==================== Toggle Password Visibility ====================*/
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  /*==================== End of Toggle Password Visibility ====================*/

  /*==================== Format Date Helpers ====================*/
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatLastLogin = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  /*==================== End of Format Date Helpers ====================*/

  /*==================== Loading State ====================*/
  if (isLoading) {
    return (
      <DashboardLayout token={userData.token} title="Admin Profile">
        <UserProfileSkeleton />
      </DashboardLayout>
    );
  }
  /*==================== End of Loading State ====================*/

  /*==================== Error State ====================*/
  if (error) {
    return (
      <DashboardLayout token={userData.token} title="Admin Profile">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-red-500 mb-4">Failed to load profile</div>
          <p className="text-gray-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }
  /*==================== End of Error State ====================*/

  return (
    <DashboardLayout token={userData.token} title="Admin Profile">
      {/*==================== Page Header ====================*/}
      <DashboardPageHeader
        title="Admin"
        subtitle="Profile"
        description="Manage your administrator account settings and personal information"
      />
      {/*==================== End of Page Header ====================*/}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/*==================== Profile Information Card ====================*/}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Crown className="h-5 w-5 text-amber-600 mr-2" />
                Administrator Profile
              </h2>
              {!isEditingProfile && (
                <button
                  onClick={handleProfileEdit}
                  className="inline-flex items-center rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
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
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-1.5 transition-colors"
                      disabled={isUploadingImage}
                    >
                      <Camera className="h-3 w-3" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {profile?.firstName} {profile?.lastName}
                    </h3>
                    <p className="text-gray-600">{profile?.schoolEmail}</p>
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
                      First Name
                    </label>
                    <p className="text-gray-900 font-medium">{profile?.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Last Name
                    </label>
                    <p className="text-gray-900 font-medium">{profile?.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900 font-medium">{profile?.schoolEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                      <Crown className="w-4 h-4 mr-1" />
                      Administrator
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /*==================== Edit Mode ====================*/
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {profileForm.profilePictureUrl || profile?.profilePictureUrl ? (
                      <img
                        src={profileForm.profilePictureUrl || profile?.profilePictureUrl}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-1.5 transition-colors"
                      disabled={isUploadingImage}
                    >
                      <Camera className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, firstName: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleProfileSave}
                    disabled={isUpdatingProfile}
                    className="inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleProfileCancel}
                    className="inline-flex items-center rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {/*==================== End of Edit Mode ====================*/}
          </div>

          {/*==================== Password & Security Card ====================*/}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Lock className="h-5 w-5 text-amber-600 mr-2" />
                Security Settings
              </h2>
              {!isChangingPasswordMode && (
                <button
                  onClick={() => setIsChangingPasswordMode(true)}
                  className="inline-flex items-center rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </button>
              )}
            </div>

            {!isChangingPasswordMode ? (
              <div className="text-gray-600">
                <p className="mt-2 mb-4">Keep your account secure by using a strong password.</p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Password Requirements:</strong> At least 6 characters with uppercase,
                    lowercase, number, and special character.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handlePasswordSave}
                    disabled={isChangingPassword}
                    className="inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    onClick={handlePasswordCancel}
                    className="inline-flex items-center rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          {/*==================== End of Password & Security Card ====================*/}
        </div>
        {/*==================== End of Profile Information Card ====================*/}

        {/*==================== Account Summary Card ====================*/}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-amber-600 mr-2" />
              Account Summary
            </h3>
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

      {/*==================== Hidden File Input ====================*/}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfilePictureUpload}
        className="hidden"
      />
      {/*==================== End of Hidden File Input ====================*/}
    </DashboardLayout>
  );
};

export default AdminProfilePage;

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

  if (userAuth.role === 'user') {
    return {
      redirect: {
        destination: '/student',
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
