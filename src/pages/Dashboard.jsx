import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEmergencyRequests, getDonationHistory, respondToRequest } from '../api/donorApi';
import { Droplet, Zap, HeartPulse, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import StatsOverview from '../components/dashboard/StatsOverview';
import EmergencyAlert from '../components/dashboard/EmergencyAlert';

const getRank = (count) => {
  if (count >= 20) return 'Platinum';
  if (count >= 10) return 'Gold';
  if (count >= 5)  return 'Silver';
  return 'Bronze';
};

const Dashboard = () => {
  const { user } = useAuth();
  const [requests,     setRequests]     = useState([]);
  const [history,      setHistory]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [respondingId, setRespondingId] = useState(null);

  const fetchData = async () => {
    try {
      const [reqRes, histRes] = await Promise.all([
        getEmergencyRequests(),
        getDonationHistory(),
      ]);
      setRequests(reqRes.data);
      setHistory(histRes.data);
    } catch {
      toast.error('Failed to sync dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRespond = async (requestId) => {
    setRespondingId(requestId);
    try {
      await respondToRequest(requestId);
      toast.success("You're registered! Please proceed to the hospital.");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond');
    } finally {
      setRespondingId(null);
    }
  };

  const filteredRequests = requests.filter(r => r.blood_group === user?.blood_group);
  const livesImpacted    = history.length * 3;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="animate-spin text-rose-500" size={32} />
        <p className="text-slate-400 text-sm font-medium">Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <div className="bg-rose-600 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-rose-200">

        {/* Icon avatar */}
        <div className="h-16 w-16 bg-rose-500 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
          <HeartPulse size={30} className="text-rose-100" />
        </div>

        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-rose-300 text-xs font-bold uppercase tracking-widest">Welcome back</p>
          <h1 className="text-3xl font-black text-white mt-1">{user?.name}</h1>
          <p className="text-rose-200 text-sm mt-1">
            Your kindness has impacted up to{' '}
            <span className="text-white font-black">{livesImpacted} lives</span>.
          </p>
        </div>

        {/* Blood group */}
        <div className="bg-rose-700 rounded-2xl px-6 py-4 text-center shrink-0 shadow-inner">
          <div className="flex items-center gap-2 justify-center">
            <Droplet size={20} className="text-rose-300" fill="currentColor" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-rose-300">Blood Type</p>
              <p className="text-3xl font-black text-white leading-none">{user?.blood_group}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Stats ──────────────────────────────────────────────────── */}
      <StatsOverview stats={{
        total:    history.length,
        lastDate: history[0]?.donated_at
          ? new Date(history[0].donated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
          : null,
        rank:     getRank(history.length),
      }} />

      {/* ─── Live Alerts ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            Live Emergency Alerts
          </h2>
          {filteredRequests.length > 0 && (
            <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
              {filteredRequests.length} active
            </span>
          )}
        </div>

        {filteredRequests.length > 0 ? (
          <div className="grid gap-3">
            {filteredRequests.map(req => (
              <EmergencyAlert
                key={req.id}
                request={req}
                responding={respondingId === req.id}
                onRespond={() => handleRespond(req.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Zap size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-600 font-bold">All clear right now</p>
            <p className="text-slate-400 text-sm mt-1">
              No emergency requests for blood type {user?.blood_group} in your area.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;