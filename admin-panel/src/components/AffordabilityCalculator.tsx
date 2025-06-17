
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

const AffordabilityCalculator: React.FC = () => {
  const [grossIncome, setGrossIncome] = useState<number>(100000);
  const [monthlyDebt, setMonthlyDebt] = useState<number>(1000);
  const [downPayment, setDownPayment] = useState<number>(50000);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [loanTerm, setLoanTerm] = useState<number>(25);
  const [affordablePrice, setAffordablePrice] = useState<number>(0);
  const [monthlyMortgage, setMonthlyMortgage] = useState<number>(0);

  const calculateAffordability = useCallback(() => {
    // Convert annual income to monthly
    const monthlyIncome = grossIncome / 12;
    
    // Maximum monthly payment (using standard 39% GDS and 44% TDS ratios)
    // GDS = Gross Debt Service ratio - housing costs shouldn't exceed 39% of income
    // TDS = Total Debt Service ratio - all debt payments shouldn't exceed 44% of income
    const maxGDSPayment = monthlyIncome * 0.39;
    const maxTDSPayment = (monthlyIncome * 0.44) - monthlyDebt;
    
    // Use the lower of the two maximums
    const maxMonthlyPayment = Math.min(maxGDSPayment, maxTDSPayment);
    
    // Calculate affordable mortgage using the payment
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Calculate mortgage amount using the formula: P = M * [(1 - (1 + r)^-n) / r]
    // Where P is principal, M is monthly payment, r is monthly rate, n is number of payments
    const mortgageAmount = maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -numberOfPayments)) / monthlyRate);
    
    // Add down payment to get maximum affordable price
    const maxPrice = mortgageAmount + downPayment;
    
    setAffordablePrice(maxPrice > 0 ? maxPrice : 0);
    setMonthlyMortgage(maxMonthlyPayment > 0 ? maxMonthlyPayment : 0);
  }, [grossIncome, monthlyDebt, downPayment, interestRate, loanTerm]);

  useEffect(() => {
    calculateAffordability();
  }, [calculateAffordability]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    calculateAffordability();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Affordability Calculator</CardTitle>
          <CardDescription>
            Calculate how much home you can afford based on your income and expenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Annual Household Income: {formatCurrency(grossIncome)}</label>
                <div className="mb-1">
                  <Slider 
                    value={[grossIncome]} 
                    min={30000} 
                    max={500000} 
                    step={5000} 
                    onValueChange={(value) => setGrossIncome(value[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$30,000</span>
                  <span>$500,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Monthly Debt Payments: {formatCurrency(monthlyDebt)}</label>
                <div className="mb-1">
                  <Slider 
                    value={[monthlyDebt]} 
                    min={0} 
                    max={10000} 
                    step={100} 
                    onValueChange={(value) => setMonthlyDebt(value[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$10,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Down Payment: {formatCurrency(downPayment)}</label>
                <div className="mb-1">
                  <Slider 
                    value={[downPayment]} 
                    min={0} 
                    max={300000} 
                    step={5000} 
                    onValueChange={(value) => setDownPayment(value[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$300,000</span>
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
            Your home affordability estimate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-500">You Can Afford</h4>
            <p className="text-3xl font-bold text-realtor-navy">
              {formatCurrency(affordablePrice)}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-500">Monthly Mortgage Payment</h4>
            <p className="text-3xl font-bold text-realtor-navy">
              {formatCurrency(monthlyMortgage)}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Mortgage Amount</span>
              <span className="font-medium">{formatCurrency(affordablePrice - downPayment)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Down Payment</span>
              <span className="font-medium">{formatCurrency(downPayment)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-600 font-medium">Total Price</span>
              <span className="font-bold">{formatCurrency(affordablePrice)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffordabilityCalculator;
