
import React, { useState, useEffect } from 'react';
import CalculatorButton from '@/components/CalculatorButton';
import CalculatorDisplay from '@/components/CalculatorDisplay';
import CalculatorHistory from '@/components/CalculatorHistory';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from '@/components/ui/use-toast';

type HistoryItem = {
  expression: string;
  result: string;
};

const Calculator = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load history from localStorage if available
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing history from localStorage', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  const handleButtonClick = (value: string) => {
    switch (value) {
      case 'C':
        clearInput();
        break;
      case '←':
        handleBackspace();
        break;
      case '=':
        calculateResult();
        break;
      case '%':
        handlePercentage();
        break;
      default:
        updateInput(value);
        break;
    }
  };

  const clearInput = () => {
    setInput('');
    setResult('');
  };

  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const updateInput = (value: string) => {
    const operators = ['+', '-', '×', '÷'];
    const lastChar = input.slice(-1);
    
    // Prevent multiple operators in a row
    if (operators.includes(value) && operators.includes(lastChar)) {
      setInput(prev => prev.slice(0, -1) + value);
      return;
    }
    
    // Prevent starting with an operator except minus
    if (input === '' && operators.includes(value) && value !== '-') {
      return;
    }

    setInput(prev => prev + value);
  };

  const handlePercentage = () => {
    if (input === '') return;
    
    try {
      // Replace ×, ÷ with *, / for evaluation
      const sanitizedInput = input
        .replace(/×/g, '*')
        .replace(/÷/g, '/');
      
      // Try to evaluate the current expression
      const currentValue = eval(sanitizedInput);
      const percentValue = currentValue / 100;
      
      setResult(percentValue.toString());
    } catch (error) {
      toast({
        title: "Lỗi tính toán",
        description: "Biểu thức không hợp lệ",
        variant: "destructive",
      });
    }
  };

  const calculateResult = () => {
    if (input === '') return;
    
    try {
      // Replace ×, ÷ with *, / for evaluation
      const sanitizedInput = input
        .replace(/×/g, '*')
        .replace(/÷/g, '/');
      
      const calculatedResult = eval(sanitizedInput).toString();
      setResult(calculatedResult);
      
      // Add to history
      const newHistoryItem = {
        expression: input,
        result: calculatedResult
      };
      
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10)); // Keep only last 10 items
    } catch (error) {
      toast({
        title: "Lỗi tính toán",
        description: "Biểu thức không hợp lệ",
        variant: "destructive",
      });
    }
  };

  const handleHistoryItemClick = (expression: string, result: string) => {
    setInput(expression);
    setResult(result);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full calculator-container p-5 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Máy Tính</h1>
        
        <CalculatorDisplay 
          input={input} 
          result={result} 
          className="mb-4"
        />
        
        <div className="grid grid-cols-4 gap-3">
          <CalculatorButton value="C" onClick={handleButtonClick} type="action" />
          <CalculatorButton value="%" onClick={handleButtonClick} type="operator" />
          <CalculatorButton value="←" onClick={handleButtonClick} type="action" />
          <CalculatorButton value="÷" onClick={handleButtonClick} type="operator" />
          
          <CalculatorButton value="7" onClick={handleButtonClick} />
          <CalculatorButton value="8" onClick={handleButtonClick} />
          <CalculatorButton value="9" onClick={handleButtonClick} />
          <CalculatorButton value="×" onClick={handleButtonClick} type="operator" />
          
          <CalculatorButton value="4" onClick={handleButtonClick} />
          <CalculatorButton value="5" onClick={handleButtonClick} />
          <CalculatorButton value="6" onClick={handleButtonClick} />
          <CalculatorButton value="-" onClick={handleButtonClick} type="operator" />
          
          <CalculatorButton value="1" onClick={handleButtonClick} />
          <CalculatorButton value="2" onClick={handleButtonClick} />
          <CalculatorButton value="3" onClick={handleButtonClick} />
          <CalculatorButton value="+" onClick={handleButtonClick} type="operator" />
          
          <CalculatorButton value="0" onClick={handleButtonClick} fullWidth />
          <CalculatorButton value="." onClick={handleButtonClick} />
          <CalculatorButton value="=" onClick={handleButtonClick} type="equal" />
        </div>
      </div>
      
      <div className="max-w-md w-full mt-4">
        <CalculatorHistory 
          history={history} 
          onHistoryItemClick={handleHistoryItemClick} 
        />
      </div>
    </div>
  );
};

export default Calculator;
