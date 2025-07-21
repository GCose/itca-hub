import { useRouter } from 'next/router';
import { ArrowLeft, Download, FileText, Loader } from 'lucide-react';
import Link from 'next/link';
import { UserAuth } from '@/types';
import { isLoggedIn } from '@/utils/auth';
import { NextApiRequest } from 'next';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import AudioViewer from '@/components/dashboard/resource-viewers/audio-viewer';
import GenericViewer from '@/components/dashboard/resource-viewers/generic-viewer';
import ImageViewer from '@/components/dashboard/resource-viewers/image-viewer';
import PDFViewer from '@/components/dashboard/resource-viewers/pdf-viewer';
import TextViewer from '@/components/dashboard/resource-viewers/text-viewer';
import VideoViewer from '@/components/dashboard/resource-viewers/video-viewer';
import useResourceAnalytics from '@/hooks/admin/resources/use-resource-analytics';
import useResourceViewer from '@/hooks/admin/resources/use-resource-viewer';
import useDownload from '@/hooks/use-download';
import formatDepartment from '@/utils/format-department';

interface ResourceViewPageProps {
  userData: UserAuth;
}

const ResourceViewPage = ({ userData }: ResourceViewPageProps) => {
  const router = useRouter();
  const { id } = router.query;

  const { resource, isLoading, error, fileType } = useResourceViewer({
    resourceId: id as string,
    token: userData.token,
  });

  const { trackResourceDownload } = useResourceAnalytics({ token: userData.token });
  const { downloadResource, isDownloading } = useDownload();

  /**=======================================================================
   * Formats category name by replacing underscores and capitalizing words
   =======================================================================*/
  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleDownload = async () => {
    if (!resource) return;

    try {
      await trackResourceDownload(resource.resourceId, userData.token);
      await downloadResource(resource.fileUrl, resource.fileName, resource.title);
    } catch (error) {
      console.error('Error downloading resource:', error);
    }
  };

  // Render appropriate viewer based on file type
  const renderViewer = () => {
    if (!resource) return null;

    switch (fileType) {
      case 'pdf':
        return (
          <PDFViewer
            title={resource.title}
            fileUrl={resource.fileUrl}
            resourceId={resource.resourceId}
          />
        );
      case 'image':
        return (
          <ImageViewer
            title={resource.title}
            resourceId={resource.resourceId}
            fileUrl={resource.fileUrl}
          />
        );
      case 'video':
        return (
          <VideoViewer
            title={resource.title}
            resourceId={resource.resourceId}
            fileUrl={resource.fileUrl}
          />
        );
      case 'audio':
        return (
          <AudioViewer
            title={resource.title}
            resourceId={resource.resourceId}
            fileUrl={resource.fileUrl}
          />
        );
      case 'text':
        return (
          <TextViewer
            title={resource.title}
            resourceId={resource.resourceId}
            fileUrl={resource.fileUrl}
          />
        );
      default:
        return (
          <GenericViewer
            fileUrl={resource.fileUrl}
            title={resource.title}
            fileType={resource.type}
            resourceId={resource.resourceId}
            token={userData.token}
          />
        );
    }
  };

  return (
    <DashboardLayout title={resource?.title || 'Resource Viewer'}>
      <div className="mb-8">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-3 inline-flex items-center rounded-lg bg-white p-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-blue-700 mr-2">Resource</span>
              <span className="text-amber-500">Viewer</span>
            </h1>
            <p className="text-gray-600">View and download resource content</p>
          </div>
        </div>
      </div>

      {/*==================== Loading State ====================*/}
      {isLoading && (
        <div className="flex items-center justify-center h-96 bg-white rounded-xl">
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-600">Loading resource...</p>
          </div>
        </div>
      )}
      {/*==================== End of Loading State ====================*/}

      {/*==================== Error State ====================*/}
      {error && (
        <div className="flex items-center justify-center h-96 bg-white rounded-xl">
          <div className="flex flex-col items-center">
            <FileText className="h-16 w-16 text-red-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Resource Not Found</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Link
              href="/admin/resources"
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Resources
            </Link>
          </div>
        </div>
      )}
      {/*==================== End of Error State ====================*/}

      {/*==================== Resource Content ====================*/}
      {!isLoading && !error && resource && (
        <div className="space-y-6">
          {/*==================== Resource Info Card ====================*/}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{resource.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-xs text-gray-500">CATEGORY</p>
                  <p className="text-sm font-medium">{formatCategoryName(resource.category)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">DEPARTMENT</p>
                  <p className="text-sm font-medium">{formatDepartment(resource.department)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">FILE TYPE</p>
                  <p className="text-sm font-medium">
                    {resource?.type?.toUpperCase() || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">FILE SIZE</p>
                  <p className="text-sm font-medium">{resource.fileSize}</p>
                </div>
              </div>
            </div>
          </div>
          {/*==================== End of Resource Info Card ====================*/}

          {/*==================== Resource Viewer Card ====================*/}
          <div className="bg-white/50 rounded-2xl overflow-hidden">
            <div className="h-[800px]">{renderViewer()}</div>
          </div>
          {/*==================== End of Resource Viewer Card ====================*/}
        </div>
      )}
      {/*==================== End of Resource Content ====================*/}
    </DashboardLayout>
  );
};

export default ResourceViewPage;

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
