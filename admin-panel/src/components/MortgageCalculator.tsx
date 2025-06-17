
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const MortgageCalculator: React.FC = () => {
  const [homePrice, setHomePrice] = useState<number>(500000);
  const [downPayment, setDownPayment] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [loanTerm, setLoanTerm] = useState<number>(25);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  const calculateMortgage = useCallback(() => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      setTotalPayment(0);
      return;
    }

    // Calculate monthly payment
    const x = Math.pow(1 + monthlyRate, numberOfPayments);
    const monthly = (principal * x * monthlyRate) / (x - 1);
    
    setMonthlyPayment(monthly);
    setTotalPayment(monthly * numberOfPayments);
    setTotalInterest((monthly * numberOfPayments) - principal);
  }, [homePrice, downPayment, interestRate, loanTerm]);

  useEffect(() => {
    calculateMortgage();
  }, [calculateMortgage]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    calculateMortgage();
  };

  const handleDownPaymentChange = (value: string) => {
    const newDownPayment = Number(value);
    if (newDownPayment > homePrice) {
      setDownPayment(homePrice);
    } else {
      setDownPayment(newDownPayment);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Mortgage Calculator</CardTitle>
          <CardDescription>
            Calculate your estimated monthly mortgage payment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Home Price: {formatCurrency(homePrice)}</label>
                <div className="mb-1">
                  <Slider 
                    value={[homePrice]} 
                    min={100000} 
                    max={5000000} 
                    step={10000} 
                    onValueChange={(value) => setHomePrice(value[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$100,000</span>
                  <span>$5,000,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Down Payment: {formatCurrency(downPayment)}</label>
                <div className="mb-1">
                  <Slider 
                    value={[downPayment]} 
                    min={0} 
                    max={homePrice} 
                    step={5000} 
                    onValueChange={(value) => setDownPayment(value[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>{formatCurrency(homePrice)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Interest Rate: {interestRate}%</label>
                <div className="mb-1">
                  <Slider 
                    value={[interestRate]} 
                    min={0.1} 
                    max={10} 
                    step={0.1} 
                    onValueChange={(value) => setInterestRate(value[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0.1%</span>
                  <span>10%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Loan Term: {loanTerm} years</label>
                <div className="mb-1">
                  <Slider 
                    value={[loanTerm]} 
                    min={5} 
                    max={30} 
                    step={5} 
                    onValueChange={(value) => setLoanTerm(value[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5 years</span>
                  <span>30 years</span>
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full bg-realtor-navy hover:bg-realtor-navy/90"
            >
              Calculate
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>
            Your estimated mortgage details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-500">Mortgage Amount</h4>
            <p className="text-3xl font-bold text-realtor-navy">
              {formatCurrency(homePrice - downPayment)}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-500">Monthly Payment</h4>
            <p className="text-3xl font-bold text-realtor-navy">
              {formatCurrency(monthlyPayment)}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Principal</span>
              <span className="font-medium">{formatCurrency(homePrice - downPayment)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total Interest</span>
              <span className="font-medium">{formatCurrency(totalInterest)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-600 font-medium">Total Payment</span>
              <span className="font-bold">{formatCurrency(totalPayment)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MortgageCalculator;
