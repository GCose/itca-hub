import { useState } from "react";
import ResourceUploader from "@/components/dashboard/admin/resources/resource-uploader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

const AdminResourceUploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState<{
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
  } | null>(null);

  const handleUploadComplete = (fileData: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
  }) => {
    setUploadedFile(fileData);
  };

  function handleUploadError() {
    throw new Error("Function not implemented.");
  }

  return (
    <DashboardLayout title="Upload Resource">
      <div className="relative">
        <div className="relative z-10">
          <div className="mb-8">
            <div className="flex items-center">
              <Link
                href="/admin/resources"
                className="mr-3 inline-flex items-center rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <span className="text-blue-700 mr-2">Upload</span>
                  <span className="text-amber-500">Resources</span>
                  <span className="ml-3 relative">
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  </span>
                </h1>
                <p className="text-gray-600">
                  Add new educational materials to the resource library
                </p>
              </div>
            </div>
          </div>

          <ResourceUploader
            onError={handleUploadError}
            onUploadComplete={handleUploadComplete}
          />

          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Upload Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
              <li>
                All uploaded resources should be relevant to educational
                purposes.
              </li>
              <li>
                Maximum file size is 100MB. For larger files, consider splitting
                them into smaller parts.
              </li>
              <li>
                Supported file types include PDFs, documents, spreadsheets,
                presentations, images, videos, and more.
              </li>
              <li>
                Ensure you have the necessary rights or permissions to share
                uploaded content.
              </li>
              <li>
                Choose a descriptive title and appropriate category to make
                resources easy to find.
              </li>
              <li>
                Add a clear description to help users understand what the
                resource contains.
              </li>
            </ul>
          </div>

          {/*==================== Show link to return to resources if there's an uploaded file ====================*/}
          {uploadedFile && (
            <div className="mt-6 text-center">
              <Link
                href="/admin/resources"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Return to Resource Management
              </Link>
            </div>
          )}
          {/*==================== End of Show link to return to resources if there's an uploaded file ====================*/}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminResourceUploadPage;
