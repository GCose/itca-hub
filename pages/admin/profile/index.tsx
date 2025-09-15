import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { AdminProfilePageProps } from '@/types/interfaces/profile';
import ProfileComponent from '@/components/dashboard/shared/profile/profile';

const AdminProfilePage = ({ userData }: AdminProfilePageProps) => {
  return <ProfileComponent role="admin" userData={userData} />;
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
