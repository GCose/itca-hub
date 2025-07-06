import { toast } from 'sonner';
import { BASE_URL } from './url';

/**===========================================================================
 * Utility function to handle resource downloads consistently across the app
 ===========================================================================*/
export const downloadResource = async (
  fileUrl: string,
  fileName: string,
  title: string
): Promise<boolean> => {
  try {
    // First attempt: Try to get mediaLink from Jeetix for proper download
    try {
      const jeetixResponse = await fetch(
        `${BASE_URL}/storage/file/${encodeURIComponent(fileName)}`
      );

      if (jeetixResponse.ok) {
        const jeetixData = await jeetixResponse.json();

        if (jeetixData.status === 'success' && jeetixData.data.metadata?.mediaLink) {
          // Use the direct media link for download
          const downloadUrl = jeetixData.data.metadata.mediaLink;

          // Create temporary link and trigger download
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = title || fileName;
          link.style.display = 'none';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          return true;
        }
      }
    } catch (jeetixError) {
      console.warn('Jeetix mediaLink fetch failed, trying direct URL:', jeetixError);
    }

    // Fallback: Use the direct file URL
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = title || fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Download failed:', error);

    // Last resort: Open in new tab
    try {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      return true;
    } catch (openError) {
      console.error('Failed to open file in new tab:', openError);
      return false;
    }
  }
};

/**===================================================================
 * Handle download with proper user feedback and analytics tracking
 ===================================================================*/
export const handleResourceDownload = async (
  resource: {
    id: string;
    title: string;
    fileName: string;
    fileUrl: string;
  },
  trackDownload?: (resourceId: string, token: string) => Promise<void>,
  token?: string
) => {
  try {
    // Track download first if tracking function is provided
    if (trackDownload && token) {
      await trackDownload(resource.id, token);
    }

    // Attempt download
    const success = await downloadResource(resource.fileUrl, resource.fileName, resource.title);

    if (success) {
      toast.success('Download started', {
        description: `${resource.title} is being downloaded.`,
      });
    } else {
      toast.error('Download failed', {
        description: 'Please try again or contact support.',
      });
    }

    return success;
  } catch (error) {
    console.error('Error in handleResourceDownload:', error);
    toast.error('Download failed', {
      description: 'Please try again or contact support.',
    });
    return false;
  }
};
