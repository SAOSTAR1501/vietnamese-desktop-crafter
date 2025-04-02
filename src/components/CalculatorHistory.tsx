
import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type HistoryItem = {
  expression: string;
  result: string;
};

type CalculatorHistoryProps = {
  history: HistoryItem[];
  onHistoryItemClick: (expression: string, result: string) => void;
  className?: string;
};

const CalculatorHistory: React.FC<CalculatorHistoryProps> = ({
  history,
  onHistoryItemClick,
  className,
}) => {
  if (history.length === 0) {
    return (
      <div className={cn('calculator-history rounded-xl p-4', className)}>
        <h3 className="text-lg font-medium mb-2">Lịch sử tính toán</h3>
        <p className="text-gray-500 text-sm">Chưa có lịch sử</p>
      </div>
    );
  }

  return (
    <div className={cn('calculator-history rounded-xl p-4', className)}>
      <h3 className="text-lg font-medium mb-2">Lịch sử tính toán</h3>
      <ScrollArea className="h-[200px] pr-2">
        {history.map((item, index) => (
          <div
            key={index}
            className="p-2 mb-2 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onHistoryItemClick(item.expression, item.result)}
          >
            <div className="text-sm text-gray-600">{item.expression}</div>
            <div className="text-lg font-semibold">{item.result}</div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default CalculatorHistory;
