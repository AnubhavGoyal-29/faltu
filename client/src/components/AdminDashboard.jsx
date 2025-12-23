import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_REGISTRY } from '../activities/registry';

const AdminDashboard = () => {
    const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [stats, setStats] = useState(null);
    const [events, setEvents] = useState([]);
    const [popularity, setPopularity] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async (activeToken) => {
        setLoading(true);
        try {
            const headers = { 'x-admin-token': activeToken };

            const [statsRes, eventsRes, popRes] = await Promise.all([
                fetch('/api/admin/stats', { headers }),
                fetch('/api/admin/events', { headers }),
                fetch('/api/admin/activity-popularity', { headers })
            ]);

            if (statsRes.status === 401) {
                setIsAuthenticated(false);
                return;
            }

            const statsData = await statsRes.json();
            const eventsData = await eventsRes.json();
            const popData = await popRes.json();

            setStats(statsData);
            setEvents(eventsData);
            setPopularity(popData);
            setIsAuthenticated(true);
            localStorage.setItem('admin_token', activeToken);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        fetchDashboardData(token);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex-center p-6">
                <div className="glass-card w-full max-w-sm">
                    <h1 className="text-2xl font-bold mb-6 text-center title-gradient">Admin Access</h1>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <input
                            type="password"
                            placeholder="Admin Token"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                        <button type="submit" className="btn-primary w-full">Visualize Reality</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black title-gradient tracking-tighter">FALTUVERSE OPS</h1>
                        <p className="text-[var(--text-secondary)] font-mono text-sm">Monitoring the chaos...</p>
                    </div>
                    <button
                        onClick={() => { setIsAuthenticated(false); localStorage.removeItem('admin_token'); }}
                        className="btn-secondary !py-2 !px-4 text-sm"
                    >
                        Logout
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard title="Total Users" value={stats?.total_users || 0} icon="👥" />
                    <StatCard title="Total Sessions" value={stats?.total_sessions || 0} icon="🌌" />
                    <StatCard title="Completions" value={stats?.total_completions || 0} icon="✅" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Activity Popularity */}
                    <div className="glass-card">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span>🔥</span> Popular Activities
                        </h2>
                        <div className="space-y-4">
                            {popularity.map((item, idx) => (
                                <div key={item.activity_id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono opacity-40">#{idx + 1}</span>
                                        <span className="font-medium">{item.activity_id}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-24 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                                style={{ width: `${(item.count / popularity[0].count) * 100}%` }}
                                            />
                                        </div>
                                        <span className="font-mono text-sm opacity-60">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Events */}
                    <div className="glass-card overflow-hidden flex flex-col">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span>🕒</span> Real-time Pulse
                        </h2>
                        <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                            {events.map((ev) => (
                                <div key={ev.id} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs font-mono">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-purple-400">{ev.event_name}</span>
                                        <span className="opacity-30">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="opacity-50 truncate">User: {ev.anonymous_user_id.split('-')[0]}...</div>
                                    {ev.activity_id && <div className="text-pink-400 mt-1">Activity: {ev.activity_id}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="glass-card flex items-center gap-6">
        <div className="text-4xl">{icon}</div>
        <div>
            <div className="text-[var(--text-secondary)] text-sm font-bold uppercase tracking-widest">{title}</div>
            <div className="text-3xl font-black">{value}</div>
        </div>
    </div>
);

export default AdminDashboard;
