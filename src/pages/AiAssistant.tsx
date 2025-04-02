
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from '@/components/ui/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { LinkPreview } from '@/components/LinkPreview';

// URL regex pattern to find links in text
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

const AiAssistant = () => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('geminiApiKey') || '';
  });
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<{question: string, answer: string}[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Save API key to localStorage when it changes
  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('geminiApiKey', key);
    toast({
      title: "API Key đã được lưu",
      description: "Khóa API Gemini của bạn đã được lưu trữ cục bộ",
    });
  };

  // Extract URLs from text
  const extractUrls = (text: string): string[] => {
    return text.match(URL_REGEX) || [];
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey) {
      toast({
        title: "Cần có API Key",
        description: "Vui lòng nhập API Key Gemini của bạn trong cài đặt",
        variant: "destructive",
      });
      return;
    }

    if (!query.trim()) {
      toast({
        title: "Câu hỏi trống",
        description: "Vui lòng nhập câu hỏi của bạn",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResponse('');
    
    try {
      // Call Gemini API
      const result = await fetchGeminiResponse(query, apiKey);
      setResponse(result);
      
      // Add to conversation history
      setConversations(prev => [
        { question: query, answer: result },
        ...prev
      ]);
      
      // Clear query field and preview
      setQuery('');
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error fetching from Gemini:', error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối với Gemini AI. Kiểm tra API key và thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGeminiResponse = async (prompt: string, key: string) => {
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    const response = await fetch(`${apiUrl}?key=${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Unknown error');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text || 'Không có phản hồi từ AI';
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trợ lý AI Gemini</h1>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Cài đặt API</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Cài đặt API Gemini</SheetTitle>
                <SheetDescription>
                  Nhập API key Gemini của bạn để sử dụng trợ lý AI
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    API key sẽ được lưu trữ cục bộ trong trình duyệt của bạn và không được gửi đến máy chủ của chúng tôi.
                  </p>
                  <Input
                    placeholder="Nhập API key Gemini của bạn"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    type="password"
                  />
                  <Button onClick={() => saveApiKey(apiKey)} className="w-full">
                    Lưu API Key
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Cách lấy API key Gemini:</p>
                  <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Truy cập Google AI Studio (ai.google.dev)</li>
                    <li>Đăng nhập với tài khoản Google của bạn</li>
                    <li>Đi đến cài đặt API key</li>
                    <li>Tạo một API key mới</li>
                    <li>Sao chép và dán vào đây</li>
                  </ol>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <ThemeToggle />
        </div>
      </div>

      <div className="flex-1 grid gap-4 md:grid-cols-5">
        <div className="md:col-span-3 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
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
        </div>

        <div className="md:col-span-2">
          <div className="bg-card p-4 rounded-lg border h-full">
            <h2 className="font-medium mb-4">Lịch sử hội thoại</h2>
            {conversations.length === 0 ? (
              <div className="text-muted-foreground text-center py-8">
                Chưa có hội thoại nào
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {conversations.map((conv, idx) => (
                  <div key={idx} className="border rounded-lg p-3 text-sm">
                    <div className="font-medium">Q: {conv.question}</div>
                    <div className="mt-2 text-muted-foreground line-clamp-3">
                      A: {conv.answer}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
