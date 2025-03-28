import { useState } from "react";
import ResourceUploader from "@/components/dashboard/admin/resource-uploader";
import { AlertCircle, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

const AdminResourceUploadPage = () => {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
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
    setUploadSuccess(true);
    setUploadError("");
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setUploadSuccess(false);
  };

  return (
    <DashboardLayout title="Upload Resource">
      <div className="mb-8">
        <div className="flex items-center">
          <Link
            href="/admin/resources"
            className="mr-3 inline-flex items-center rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Upload Resource
            </h1>
            <p className="text-gray-600">
              Add new educational materials to the resource library
            </p>
          </div>
        </div>
      </div>

      {uploadSuccess && uploadedFile && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
          <div className="flex">
            <Check className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Upload Successful</h3>
              <div className="mt-2 text-sm">
                <p>
                  The file has been uploaded successfully and is now available
                  in the resource library.
                </p>
                <ul className="mt-1.5 list-inside space-y-1">
                  <li>
                    <strong>File Name:</strong> {uploadedFile.fileName}
                  </li>
                  <li>
                    <strong>File Size:</strong> {uploadedFile.fileSize}
                  </li>
                  <li>
                    <strong>URL:</strong>{" "}
                    <a
                      href={uploadedFile.fileUrl}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {uploadedFile.fileUrl.substring(0, 60)}...
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
          <div className="flex">
            <AlertCircle className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Upload Failed</h3>
              <div className="mt-2 text-sm">
                <p>{uploadError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ResourceUploader
        onUploadComplete={handleUploadComplete}
        onError={handleUploadError}
      />

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Upload Guidelines
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
          <li>
            All uploaded resources should be relevant to educational purposes.
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
            Add a clear description to help users understand what the resource
            contains.
          </li>
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default AdminResourceUploadPage;
