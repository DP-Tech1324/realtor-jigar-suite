import React from 'react';
import { Building, CalendarCheck, Compass, Mail, MessageSquare } from 'lucide-react';
import type { ActivityKind } from '@/hooks/useActivityFeed';

const ICONS: Record<ActivityKind, { icon: React.ElementType; className: string }> = {
  inquiry: { icon: MessageSquare, className: 'text-orange-600 bg-orange-50' },
  consultation: { icon: CalendarCheck, className: 'text-purple-600 bg-purple-50' },
  subscriber: { icon: Mail, className: 'text-green-600 bg-green-50' },
  listing: { icon: Building, className: 'text-blue-600 bg-blue-50' },
  vastu: { icon: Compass, className: 'text-amber-600 bg-amber-50' },
};

export const ActivityIcon: React.FC<{ kind: ActivityKind }> = ({ kind }) => {
  const { icon: Icon, className } = ICONS[kind];
  return (
    <span className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${className}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
  );
};
