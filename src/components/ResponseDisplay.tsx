
import React from 'react';
import { LinkPreview } from '@/components/LinkPreview';
import { extractUrls } from '@/utils/urlUtils';

interface ResponseDisplayProps {
  response: string;
  isLoading: boolean;
}

export const ResponseDisplay = ({ response, isLoading }: ResponseDisplayProps) => {
  return (
    <div className="bg-card p-4 rounded-lg border min-h-[200px]">
      <h2 className="font-medium mb-2">Phản hồi:</h2>
      {isLoading ? (
        <div className="animate-pulse text-muted-foreground">Đang suy nghĩ...</div>
      ) : response ? (
        <div className="whitespace-pre-line">
          {response}
          {/* Display link previews in the response */}
          {extractUrls(response).map((url, idx) => (
            <LinkPreview key={idx} url={url} />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground">Câu trả lời sẽ xuất hiện ở đây</div>
      )}
    </div>
  );
};
