
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';

interface PropertyStatsProps {
  total: number;
  published: number;
  draft: number;
  featured: number;
}

export function PropertyStats({ total, published, draft, featured }: PropertyStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5 text-realtor-gold" />
            Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{total}</div>
          <p className="text-sm text-muted-foreground">All listings</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5 text-green-500" />
            Published
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{published}</div>
          <p className="text-sm text-muted-foreground">Live now</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5 text-yellow-500" />
            Draft
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{draft}</div>
          <p className="text-sm text-muted-foreground">Not published</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" />
            Featured
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{featured}</div>
          <p className="text-sm text-muted-foreground">Special picks</p>
        </CardContent>
      </Card>
    </div>
  );
}
