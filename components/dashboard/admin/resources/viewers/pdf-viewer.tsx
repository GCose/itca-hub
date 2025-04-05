import React from "react";

interface PDFViewerProps {
  fileUrl: string;
  title: string;
  resourceId?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, title }) => {
  return (
    <div className="h-full w-full flex flex-col">
      {/*==================== PDF Embed ====================*/}
      <div className="flex-1 bg-gray-50 rounded-b-lg">
        <iframe
          title={title}
          className="w-full h-full rounded-b-lg"
          src={`${fileUrl}#toolbar=1&navpanes=1`}
        />
      </div>
      {/*==================== End of PDF Embed ====================*/}
    </div>
  );
};

export default PDFViewer;
