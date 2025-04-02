
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface ApiKeySettingsProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const ApiKeySettings = ({ apiKey, setApiKey }: ApiKeySettingsProps) => {
  const [tempApiKey, setTempApiKey] = React.useState(apiKey);
  
  // Save API key to localStorage when it changes
  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('geminiApiKey', key);
    toast({
      title: "API Key đã được lưu",
      description: "Khóa API Gemini của bạn đã được lưu trữ cục bộ",
    });
  };

  return (
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
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              type="password"
            />
            <Button onClick={() => saveApiKey(tempApiKey)} className="w-full">
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
  );
};
