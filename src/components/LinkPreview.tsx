
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';

interface LinkPreviewProps {
  url: string;
}

interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  domain: string;
}

export const LinkPreview = ({ url }: LinkPreviewProps) => {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkMetadata = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Extract domain for display
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        
        // Here we're using a proxy service to avoid CORS issues and fetch metadata
        // In a production app, you would want to implement a server-side solution
        const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setMetadata({
            title: data.data.title || 'Không có tiêu đề',
            description: data.data.description || 'Không có mô tả',
            image: data.data.image?.url || '',
            domain: domain
          });
        } else {
          throw new Error('Không thể lấy thông tin từ liên kết');
        }
      } catch (err) {
        console.error('Error fetching link metadata:', err);
        setError('Không thể tải thông tin liên kết');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchLinkMetadata();
    }
  }, [url]);

  if (error) {
    return (
      <Card className="p-3 mt-2 border border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800 text-sm">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <span>{error}</span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 flex items-center gap-1 text-sm hover:underline mt-1">
          {url} <ExternalLink size={14} />
        </a>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-3 mt-2">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden mt-2 border hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="flex flex-col sm:flex-row">
          {metadata?.image && (
            <div className="sm:w-1/3 max-h-[160px] overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img 
                src={metadata.image} 
                alt={metadata.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Hide the image on error
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="p-4 flex-1">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>{metadata?.domain}</span>
              <ExternalLink size={12} className="ml-1" />
            </div>
            <h3 className="font-medium text-md mb-1 line-clamp-2">{metadata?.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {metadata?.description}
            </p>
          </div>
        </div>
      </a>
    </Card>
  );
};
