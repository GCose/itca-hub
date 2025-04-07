import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import ResourceManager from '@/components/dashboard/student/resource/resource-manager';
import { UserAuth } from '@/types';
import { isLoggedIn } from '@/utils/auth';
import { NextApiRequest } from 'next';

const StudentResourcesPage = () => {
  return (
    <DashboardLayout title="Learning Resources">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Learning Resources</h1>
        <p className="text-gray-600">Access course materials, documents, and learning resources</p>
      </div>

      <ResourceManager />
    </DashboardLayout>
  );
};

export default StudentResourcesPage;

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
