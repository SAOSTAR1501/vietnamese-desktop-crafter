
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type CalculatorButtonProps = {
  value: string;
  onClick: (value: string) => void;
  type?: 'number' | 'operator' | 'action' | 'equal';
  className?: string;
  fullWidth?: boolean;
};

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  value,
  onClick,
  type = 'number',
  className,
  fullWidth = false,
}) => {
  const handleClick = () => {
    onClick(value);
  };

  const getVariantClass = () => {
    switch (type) {
      case 'number':
        return 'bg-calculator-button-number hover:bg-calculator-button-number/90 text-foreground';
      case 'operator':
        return 'bg-calculator-button-operator hover:bg-calculator-button-operator/90 text-foreground font-bold';
      case 'action':
        return 'bg-calculator-button-action hover:bg-calculator-button-action/90 text-white font-bold';
      case 'equal':
        return 'bg-calculator-button-equal hover:bg-calculator-button-equal/90 text-white font-bold';
      default:
        return 'bg-calculator-button-number hover:bg-calculator-button-number/90 text-foreground';
    }
  };

  return (
    <Button
      className={cn(
        'calculator-button h-16 text-xl rounded-xl',
        getVariantClass(),
        fullWidth ? 'col-span-2' : '',
        className
      )}
      onClick={handleClick}
    >
      {value}
    </Button>
  );
};

export default CalculatorButton;
