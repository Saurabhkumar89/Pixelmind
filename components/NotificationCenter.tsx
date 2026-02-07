'use client';

import { AlertCircle, Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Low Credits Alert',
      message: 'You have only 5 credits remaining. Upgrade to continue using our tools.',
      timestamp: new Date(Date.now() - 60000),
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'New Feature Available',
      message: 'Check out our new AI Style Transfer tool. Try it for free!',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: '3',
      type: 'success',
      title: 'Subscription Active',
      message: 'Your Pro plan is now active. Enjoy 1000 credits this month!',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-400/20 bg-green-400/5';
      case 'warning':
        return 'border-yellow-400/20 bg-yellow-400/5';
      case 'error':
        return 'border-red-400/20 bg-red-400/5';
      default:
        return 'border-blue-400/20 bg-blue-400/5';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Notification Bell Button */}
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>

        {/* Notifications Panel */}
        <div className="absolute bottom-16 right-0 w-80 max-h-96 overflow-y-auto glass rounded-lg p-4 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border p-4 smooth-transition cursor-pointer ${getColor(notification.type)} ${
                  !notification.read ? 'border-opacity-100' : 'border-opacity-50'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  {getIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{notification.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-400 flex-shrink-0 mt-1" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="mx-auto h-8 w-8 opacity-50 mb-2" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
