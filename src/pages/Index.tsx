
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold">Ứng dụng Tiện ích</h1>
        <p className="text-muted-foreground">Chọn một công cụ để bắt đầu</p>
        
        <div className="grid gap-4 pt-4">
          <Link to="/calculator">
            <Button className="w-full h-16 text-lg">
              Máy tính
            </Button>
          </Link>
          
          <Link to="/ai-assistant">
            <Button className="w-full h-16 text-lg" variant="outline">
              Trợ lý AI Gemini
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
