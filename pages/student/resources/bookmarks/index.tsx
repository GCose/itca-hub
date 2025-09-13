import { useEffect, useState } from 'react';
import { ArrowLeft, Bookmark, Eye, Download, BookmarkX } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import { UserAuth, Resource } from '@/types';
import { isLoggedIn } from '@/utils/auth';
import { NextApiRequest } from 'next';
import useDownload from '@/hooks/use-download';
import useResourceAnalytics from '@/hooks/admin/resources/use-resource-analytics';
import { toast } from 'sonner';
import ListTable from '@/components/dashboard/table/list-table';
import { useStudentResources } from '@/hooks/student/resources/use-student-resources';

interface StudentBookmarksPageProps {
  userData: UserAuth;
}

const StudentBookmarksPage = ({ userData }: StudentBookmarksPageProps) => {
  const router = useRouter();
  const [bookmarkedResources, setBookmarkedResources] = useState<Resource[]>([]);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const { resources, fetchResources } = useStudentResources({ token: userData.token });
  const { downloadResource } = useDownload();
  const { trackResourceDownload } = useResourceAnalytics({ token: userData.token });

  /**====================================
   * Load bookmarks from localStorage
   ====================================*/
  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const savedBookmarks = localStorage.getItem('studentBookmarks');
        if (savedBookmarks) {
          const parsedBookmarks = JSON.parse(savedBookmarks);
          setBookmarks(parsedBookmarks);
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    loadBookmarks();
  }, []);

  /**===============================================
   * Fetch resources and filter bookmarked ones
   ===============================================*/
  useEffect(() => {
    const loadBookmarkedResources = async () => {
      setIsLoading(true);
      try {
        await fetchResources();
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarkedResources();
  }, [fetchResources]);

  /**===============================================
   * Filter resources to show only bookmarked ones
   ===============================================*/
  useEffect(() => {
    const bookmarkedIds = Object.keys(bookmarks).filter((id) => bookmarks[id]);
    const filtered = resources.filter((resource) => bookmarkedIds.includes(resource.resourceId));
    setBookmarkedResources(filtered);
  }, [resources, bookmarks]);

  /**============================
   * Handle removing bookmark
   ============================*/
  const handleRemoveBookmark = (resource: Resource) => {
    const newBookmarks = { ...bookmarks };
    delete newBookmarks[resource.resourceId];
    setBookmarks(newBookmarks);
    localStorage.setItem('studentBookmarks', JSON.stringify(newBookmarks));

    toast.success('Bookmark removed', {
      description: `${resource.title} has been removed from bookmarks.`,
    });
  };

  /**=========================
   * Handle viewing resource
   =========================*/
  const handleViewResource = (resource: Resource) => {
    router.push(`/student/resources/view/${resource.resourceId}`);
  };

  /**==============================
   * Handle downloading resource
   ==============================*/
  const handleDownloadResource = async (resource: Resource) => {
    try {
      await trackResourceDownload(resource.resourceId, userData.token);
      await downloadResource(resource.fileUrl, resource.fileName, resource.title);
    } catch (error) {
      console.error('Error downloading resource:', error);
    }
  };

  /**=========================
   * Define table actions
   =========================*/
  const tableActions = [
    {
      label: 'View Resource',
      icon: <Eye className="h-4 w-4 text-gray-500" />,
      onClick: handleViewResource,
    },
    {
      label: 'Download',
      icon: <Download className="h-4 w-4 text-gray-500" />,
      onClick: handleDownloadResource,
    },
    {
      label: 'Remove Bookmark',
      icon: <BookmarkX className="h-4 w-4 text-red-500" />,
      onClick: handleRemoveBookmark,
      className: 'text-red-600',
    },
  ];

  return (
    <DashboardLayout title="Bookmarks" userData={userData}>
      <div className="mb-8">
        <div className="flex items-center">
          <Link
            href="/student"
            className="mr-3 inline-flex items-center rounded-lg bg-white p-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <DashboardPageHeader
              title="Bookmarked"
              subtitle="Resources"
              description="View and manage your saved educational materials"
            />
          </div>
        </div>
      </div>

      {/*==================== Bookmarks Table ====================*/}
      <ListTable
        resources={bookmarkedResources}
        isLoading={isLoading}
        emptyIcon={<Bookmark className="mx-auto h-12 w-12 text-gray-400" />}
        emptyMessage="No bookmarked resources yet. Start bookmarking resources from the library to see them here."
        actions={tableActions}
        showDepartment={true}
        showFileType={true}
        showCategory={true}
      />
      {/*==================== End of Bookmarks Table ====================*/}
    </DashboardLayout>
  );
};

export default StudentBookmarksPage;

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
