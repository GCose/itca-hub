import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { StudentProfilePageProps } from '@/types/interfaces/profile';
import ProfileComponent from '@/components/dashboard/shared/profile/profile';

const StudentProfilePage = ({ userData }: StudentProfilePageProps) => {
  return <ProfileComponent role="student" userData={userData} />;
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
