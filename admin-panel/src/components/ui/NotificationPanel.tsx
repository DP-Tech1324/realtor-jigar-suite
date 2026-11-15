import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLastSeen, markAllSeen, timeAgo, useActivityFeed } from '@/hooks/useActivityFeed';
import { ActivityIcon } from '@/components/ActivityIcon';

// The bell: real site activity (leads, sign-ups, listing changes). "Unread" means newer
// than the last time this browser marked everything read.
const NotificationPanel = () => {
  const navigate = useNavigate();
  const { data: activity = [], isLoading, isError } = useActivityFeed(20);
  const [isOpen, setIsOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState(getLastSeen);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isOpen]);

  const unreadCount = activity.filter((a) => a.at > lastSeen).length;

  const markAllAsRead = () => {
    markAllSeen();
    setLastSeen(getLastSeen());
  };

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label={unreadCount ? `Notifications, ${unreadCount} new` : 'Notifications'}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1 bg-red-500 text-white text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 z-50">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                      Mark all read
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6" aria-label="Close">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-96 overflow-y-auto">
              {isLoading ? (
                <p className="p-6 text-center text-sm text-gray-500">Loading…</p>
              ) : isError ? (
                <p className="p-6 text-center text-sm text-red-600">Couldn't load activity.</p>
              ) : activity.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No activity yet</p>
                  <p className="text-xs mt-1">Inquiries, consultation requests and newsletter sign-ups show up here.</p>
                </div>
              ) : (
                <div>
                  {activity.map((a) => {
                    const unread = a.at > lastSeen;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        className={cn('w-full text-left p-4 border-b hover:bg-gray-50 transition-colors', unread && 'bg-blue-50/50')}
                        onClick={() => {
                          setIsOpen(false);
                          navigate(a.link);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <ActivityIcon kind={a.kind} />
                          <div className="flex-1 min-w-0">
                            <h4 className={cn('text-sm truncate', unread ? 'font-semibold' : 'font-medium')}>{a.title}</h4>
                            {a.detail && <p className="text-sm text-gray-600 truncate">{a.detail}</p>}
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-400">{timeAgo(a.at)}</span>
                              {a.needsAction && <span className="text-xs text-orange-600 font-medium">Needs reply</span>}
                              {unread && <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto" />}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
