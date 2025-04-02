
import React from 'react';
import { cn } from '@/lib/utils';

type CalculatorDisplayProps = {
  input: string;
  result: string;
  className?: string;
};

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  input,
  result,
  className,
}) => {
  return (
    <div
      className={cn(
        'calculator-display w-full p-4 rounded-xl text-right',
        className
      )}
    >
      <div className="text-lg text-gray-300 h-6 overflow-hidden">{input}</div>
      <div className="text-3xl sm:text-4xl font-bold text-white mt-2 overflow-x-auto whitespace-nowrap">
        {result || '0'}
      </div>
    </div>
  );
};

export default CalculatorDisplay;
