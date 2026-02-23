// components/ActivityFeed.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiUser, FiDollarSign, FiMapPin, FiCamera } from 'react-icons/fi';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate real-time activities
    const generateActivity = () => {
      const types = ['view', 'update', 'photo', 'export'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const activities = [
        { type: 'view', icon: FiUser, color: 'blue', message: 'Viewed employee profile' },
        { type: 'update', icon: FiDollarSign, color: 'green', message: 'Updated salary information' },
        { type: 'photo', icon: FiCamera, color: 'purple', message: 'Captured employee photo' },
        { type: 'export', icon: FiActivity, color: 'yellow', message: 'Exported employee data' }
      ];

      return activities.find(a => a.type === type);
    };

    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        ...generateActivity(),
        time: new Date().toLocaleTimeString(),
        user: 'Admin'
      };

      setActivities(prev => [newActivity, ...prev].slice(0, 20));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredActivities = activities.filter(act => 
    filter === 'all' ? true : act.type === filter
  );

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <FiActivity />
          <span>Live Activity Feed</span>
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm"
        >
          <option value="all">All</option>
          <option value="view">Views</option>
          <option value="update">Updates</option>
          <option value="photo">Photos</option>
          <option value="export">Exports</option>
        </select>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
            >
              <div className={`p-2 bg-${activity.color}-600/20 rounded-lg`}>
                <activity.icon className={`text-${activity.color}-400`} />
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.message}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredActivities.length === 0 && (
          <p className="text-center text-gray-400 py-8">No activities yet</p>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;