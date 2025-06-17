
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

const ClosingCostCalculator: React.FC = () => {
  const [homePrice, setHomePrice] = useState<number>(500000);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState<boolean>(false);
  const [landTransferTax, setLandTransferTax] = useState<number>(0);
  const [legalFees, setLegalFees] = useState<number>(1500);
  const [titleInsurance, setTitleInsurance] = useState<number>(300);
  const [homeInspection, setHomeInspection] = useState<number>(500);
  const [movingCosts, setMovingCosts] = useState<number>(2000);
  const [adjustments, setAdjustments] = useState<number>(1000);
  const [totalClosingCosts, setTotalClosingCosts] = useState<number>(0);

  // Calculate Ontario Land Transfer Tax
  const calculateLTT = (price: number, firstTimeBuyer: boolean): number => {
    let tax = 0;
    
    if (price <= 55000) {
      tax = price * 0.005;
    } else if (price <= 250000) {
      tax = 55000 * 0.005 + (price - 55000) * 0.01;
    } else if (price <= 400000) {
      tax = 55000 * 0.005 + 195000 * 0.01 + (price - 250000) * 0.015;
    } else if (price <= 2000000) {
      tax = 55000 * 0.005 + 195000 * 0.01 + 150000 * 0.015 + (price - 400000) * 0.02;
    } else {
      tax = 55000 * 0.005 + 195000 * 0.01 + 150000 * 0.015 + 1600000 * 0.02 + (price - 2000000) * 0.025;
    }
    
    // First-time homebuyers in Ontario can receive a refund of land transfer tax up to $4,000
    if (firstTimeBuyer) {
      tax = Math.max(0, tax - 4000);
    }
    
    return tax;
  };

  // Calculate Toronto Municipal Land Transfer Tax if property is in Toronto
  // For simplicity, we're not including this in this basic calculator
  
  const calculateTotalClosingCosts = useCallback(() => {
    const ltt = calculateLTT(homePrice, isFirstTimeBuyer);
    setLandTransferTax(ltt);
    
    const total = ltt + legalFees + titleInsurance + homeInspection + movingCosts + adjustments;
    setTotalClosingCosts(total);
  }, [homePrice, isFirstTimeBuyer, legalFees, titleInsurance, homeInspection, movingCosts, adjustments]);

  useEffect(() => {
    calculateTotalClosingCosts();
  }, [calculateTotalClosingCosts]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    calculateTotalClosingCosts();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Closing Cost Calculator</CardTitle>
          <CardDescription>
            Estimate the additional costs beyond the purchase price when buying a home.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Home Purchase Price: {formatCurrency(homePrice)}</label>
                <div className="mb-1">
                  <Slider 
                    value={[homePrice]} 
                    min={100000} 
                    max={2000000} 
                    step={10000} 
                    onValueChange={(value) => setHomePrice(value[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$100,000</span>
                  <span>$2,000,000</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="firstTimeBuyer"
                  checked={isFirstTimeBuyer}
                  onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
                  className="rounded border-gray-300 text-realtor-navy focus:ring-realtor-navy"
                />
                <label htmlFor="firstTimeBuyer" className="text-sm font-medium">
                  First-Time Home Buyer (eligible for Land Transfer Tax rebate)
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Legal Fees: {formatCurrency(legalFees)}</label>
                <div className="mb-1">
                  <Slider 
                    value={[legalFees]} 
                    min={1000} 
                    max={3000} 
                    step={100} 
                    onValueChange={(value) => setLegalFees(value[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$1,000</span>
                  <span>$3,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title Insurance: {formatCurrency(titleInsurance)}</label>
                <div className="mb-1">
                  <Slider 
                    value={[titleInsurance]} 
                    min={200} 
                    max={600} 
                    step={50} 
                    onValueChange={(value) => setTitleInsurance(value[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$200</span>
                  <span>$600</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Home Inspection: {formatCurrency(homeInspection)}</label>
                <div className="mb-1">
                  <Slider 
                    value={[homeInspection]} 
                    min={0} 
                    max={1000} 
                    step={50} 
                    onValueChange={(value) => setHomeInspection(value[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$1,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Moving Costs: {formatCurrency(movingCosts)}</label>
                <div className="mb-1">
                  <Slider 
                    value={[movingCosts]} 
                    min={0} 
                    max={5000} 
                    step={100} 
                    onValueChange={(value) => setMovingCosts(value[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$5,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Adjustments & Other Costs: {formatCurrency(adjustments)}</label>
                <div className="mb-1">
                  <Slider 
                    value={[adjustments]} 
                    min={0} 
                    max={5000} 
                    step={100} 
                    onValueChange={(value) => setAdjustments(value[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$5,000</span>
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
            Your estimated closing costs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-500">Total Closing Costs</h4>
            <p className="text-3xl font-bold text-realtor-navy">
              {formatCurrency(totalClosingCosts)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Approximately {((totalClosingCosts / homePrice) * 100).toFixed(1)}% of purchase price
            </p>
          </div>
          
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Land Transfer Tax</span>
              <span className="font-medium">{formatCurrency(landTransferTax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Legal Fees</span>
              <span className="font-medium">{formatCurrency(legalFees)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Title Insurance</span>
              <span className="font-medium">{formatCurrency(titleInsurance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Home Inspection</span>
              <span className="font-medium">{formatCurrency(homeInspection)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Moving Costs</span>
              <span className="font-medium">{formatCurrency(movingCosts)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Adjustments & Other</span>
              <span className="font-medium">{formatCurrency(adjustments)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClosingCostCalculator;
