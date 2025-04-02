
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LinkPreview } from '@/components/LinkPreview';
import { extractUrls } from '@/utils/urlUtils';

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const QueryInput = ({ 
  query, 
  setQuery, 
  previewUrl, 
  setPreviewUrl, 
  onSubmit, 
  isLoading 
}: QueryInputProps) => {
  
  // Handle the user pasting content
  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    const urls = extractUrls(pastedText);
    
    if (urls.length > 0) {
      setPreviewUrl(urls[0]);
    }
  };

  // Handle text change to detect URLs
  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setQuery(newText);
    
    // Check if there's a URL in the text
    const urls = extractUrls(newText);
    if (urls.length > 0) {
      setPreviewUrl(urls[0]);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Textarea 
          placeholder="Hỏi trợ lý AI bất kỳ câu hỏi gì về toán học, tính toán, hoặc bất kỳ chủ đề nào khác..."
          value={query}
          onChange={handleQueryChange}
          onPaste={handlePaste}
          className="min-h-[120px]"
        />
        {previewUrl && <LinkPreview url={previewUrl} />}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Đang xử lý...' : 'Gửi câu hỏi'}
      </Button>
    </form>
  );
};
