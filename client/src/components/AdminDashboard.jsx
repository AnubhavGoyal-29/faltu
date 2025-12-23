import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load stats
      const statsRes = await fetch('/api/activities/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Load users
      const usersRes = await fetch('/api/activities/users');
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Faltuverse Admin Dashboard
        </h1>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="text-white/60 text-sm mb-2">Total Users</div>
              <div className="text-3xl font-bold text-white">{stats.total_users}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="text-white/60 text-sm mb-2">Completed</div>
              <div className="text-3xl font-bold text-green-400">{stats.total_completed}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="text-white/60 text-sm mb-2">Skipped</div>
              <div className="text-3xl font-bold text-yellow-400">{stats.total_skipped}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="text-white/60 text-sm mb-2">Total Activities</div>
              <div className="text-3xl font-bold text-purple-400">
                {stats.total_completed + stats.total_skipped}
              </div>
            </motion.div>
          </div>
        )}

        {/* Popular Activities */}
        {stats && stats.popular_activities && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-4">Most Popular Activities</h2>
            <div className="space-y-2">
              {stats.popular_activities.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="font-semibold">{activity.activity_id}</span>
                  <div className="flex gap-4">
                    <span className="text-green-400">{activity.completed_count} completed</span>
                    <span className="text-white/60">{activity.count} total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-4">Users ({users.length})</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((user, idx) => (
              <motion.div
                key={user.anonymous_user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedUser(selectedUser === user.anonymous_user_id ? null : user.anonymous_user_id)}
                className="p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-white/80 mb-1">
                      User: {user.anonymous_user_id.substring(0, 8)}...
                    </div>
                    <div className="text-xs text-white/60">
                      {user.completed_count} completed • {user.skipped_count} skipped • {user.total_activities} total
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      First: {new Date(user.first_activity).toLocaleString()} • 
                      Last: {new Date(user.last_activity).toLocaleString()}
                    </div>
                  </div>
                </div>

                {selectedUser === user.anonymous_user_id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <div className="text-sm font-semibold mb-2">Activities:</div>
                    <div className="space-y-1">
                      {user.activities.map((activity, aIdx) => (
                        <div key={aIdx} className="text-xs flex items-center gap-2">
                          <span className={`px-2 py-1 rounded ${
                            activity.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {activity.status}
                          </span>
                          <span>{activity.activity_id}</span>
                          <span className="text-white/40">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

