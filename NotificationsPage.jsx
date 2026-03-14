import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, MapPin, Truck, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../lib/api';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || generateStubNotifications());
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications(generateStubNotifications());
    } finally {
      setLoading(false);
    }
  };

  const generateStubNotifications = () => [
    {
      id: '1',
      type: 'bin_full',
      title: 'Bin near you is full',
      message: 'Organic bin at Main St is 92% full. Consider using another.',
      location: { coordinates: [40.7128, -74.0060] },
      time: '2 min ago',
      read: false
    },
    {
      id: '2',
      type: 'report_resolved',
      title: 'Your report was resolved',
      message: 'Broken lid on bin #ABC123 has been fixed. Thank you!',
      time: '1 hour ago',
      read: true
    },
    {
      id: '3',
      type: 'collection_scheduled',
      title: 'Collection scheduled today',
      message: 'Truck collection in your neighborhood between 2-4 PM.',
      time: 'Today, 10:32 AM',
      read: false
    }
  ];

  const getIconAndColor = (type) => {
    switch (type) {
      case 'bin_full': return { icon: MapPin, color: 'text-red-400 bg-red-500/10 border-red-500/30' };
      case 'report_resolved': return { icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'collection_scheduled': return { icon: Truck, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
      default: return { icon: Bell, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <span>Loading notifications...</span>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/citizen')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className={`relative ${unreadCount > 0 ? 'animate-pulse' : ''}`}>
            <Bell className="w-8 h-8 text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 p-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-slate-400 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
            </p>
          </div>

          <div className="divide-y divide-slate-700/50 max-h-[600px] overflow-y-auto">
            {notifications.map((notification) => {
              const { icon: Icon, color } = getIconAndColor(notification.type);
              return (
                <div 
                  key={notification.id}
                  className={`p-6 hover:bg-slate-800/50 transition-all border-l-4 ${color} cursor-pointer group`}
                  onClick={() => {/* Mark as read logic */}}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1 truncate">{notification.title}</h3>
                      <p className="text-slate-400 mb-3 leading-relaxed">{notification.message}</p>
                      {notification.location && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">Lat: {notification.location.coordinates[1].toFixed(4)}, Lng: {notification.location.coordinates[0].toFixed(4)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {notification.time}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {notifications.length === 0 && (
            <div className="p-20 text-center border-t border-slate-700">
              <Bell className="w-16 h-16 text-slate-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-300 mb-2">No notifications</h3>
              <p className="text-slate-500">You'll see updates here when they happen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

