import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import EventsComponent from '@/components/dashboard/shared/pages/events/events';
import { StudentEventsPageProps } from '@/types/interfaces/event';

const StudentEventsPage = ({ userData }: StudentEventsPageProps) => {
  return <EventsComponent role="student" userData={userData} />;
};

export default StudentEventsPage;

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
