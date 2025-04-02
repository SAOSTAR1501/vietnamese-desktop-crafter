
import React, { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from '@/components/ui/use-toast';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import { QueryInput } from '@/components/QueryInput';
import { ResponseDisplay } from '@/components/ResponseDisplay';
import { ConversationHistory } from '@/components/ConversationHistory';
import { fetchGeminiResponse } from '@/services/geminiService';

interface Conversation {
  question: string;
  answer: string;
}

const AiAssistant = () => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('geminiApiKey') || '';
  });
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trợ lý AI Gemini</h1>
        <div className="flex gap-2">
          <ApiKeySettings apiKey={apiKey} setApiKey={setApiKey} />
          <ThemeToggle />
        </div>
      </div>

      <div className="flex-1 grid gap-4 md:grid-cols-5">
        <div className="md:col-span-3 space-y-4">
          <QueryInput 
            query={query}
            setQuery={setQuery}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          <ResponseDisplay 
            response={response}
            isLoading={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <ConversationHistory conversations={conversations} />
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
