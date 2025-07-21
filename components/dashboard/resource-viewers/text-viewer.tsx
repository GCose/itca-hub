import React from 'react';

interface TextViewerProps {
  fileUrl: string;
  title: string;
  resourceId?: string;
}

const TextViewer: React.FC<TextViewerProps> = ({ fileUrl, title }) => {
  return (
    <div className="h-full w-full flex flex-col">
      {/*==================== Text File Embed ====================*/}
      <div className="flex-1 bg-gray-50 rounded-b-lg">
        <iframe title={title} className="w-full h-full rounded-b-lg border-0" src={fileUrl} />
      </div>
      {/*==================== End of Text File Embed ====================*/}
    </div>
  );
};

export default TextViewer;
