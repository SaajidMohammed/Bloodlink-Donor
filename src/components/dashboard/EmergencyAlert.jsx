import React from 'react';
import { MapPin, Droplet, Clock, Building2, User, Loader2, ChevronRight } from 'lucide-react';

const EmergencyAlert = ({ request, onRespond, responding }) => {
  const isResponded = request?.status === 'DONOR_FOUND' ||
    (typeof request?.status === 'string' && request.status.includes('successfully'));

  const urgency = request.units_required <= 1 ? 'critical' : request.units_required <= 3 ? 'high' : 'normal';
  const urgencyStyles = {
    critical: { border: 'border-red-300 shadow-red-100',  badge: 'bg-red-100 text-red-700',  label: '🚨 Critical' },
    high:     { border: 'border-orange-200 shadow-orange-100', badge: 'bg-orange-100 text-orange-700', label: '⚠️ Urgent' },
    normal:   { border: 'border-slate-100 shadow-slate-100',   badge: null,                   label: null },
  }[urgency];

  return (
    <div className={`bg-white border ${urgencyStyles.border} shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-5 group`}>

      {/* Blood group badge */}
      <div className="h-14 w-14 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-2xl flex flex-col items-center justify-center font-black shadow-lg shadow-rose-200 shrink-0">
        <span className="text-lg leading-none">{request.blood_group}</span>
        <span className="text-[9px] opacity-80 uppercase tracking-tight mt-0.5">needed</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-slate-900 text-base">{request.requester_name || 'Emergency Request'}</h3>

          {/* Request type */}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wide ${
            request.request_type === 'Hospital' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
          }`}>
            {request.request_type === 'Hospital' ? <Building2 size={9} /> : <User size={9} />}
            {request.request_type}
          </span>

          {/* Urgency badge */}
          {urgencyStyles.badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${urgencyStyles.badge}`}>
              {urgencyStyles.label}
            </span>
          )}

          {isResponded && (
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              ✓ Responded
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-slate-400" />
            {request.city || 'Emergency Unit'}
          </span>
          <span className="flex items-center gap-1 text-rose-600 font-bold">
            <Droplet size={12} fill="currentColor" />
            {request.units_required} unit{request.units_required !== 1 ? 's' : ''} needed
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-slate-400" />
            {new Date(request.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {request.reason && (
          <p className="text-xs text-slate-400 italic truncate">"{request.reason}"</p>
        )}
      </div>

      {/* CTA */}
      <div className="shrink-0 w-full md:w-auto">
        {isResponded ? (
          <div className="px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold text-center">
            Response Sent ✓
          </div>
        ) : (
          <button
            onClick={onRespond}
            disabled={responding}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95"
          >
            {responding ? (
              <><Loader2 size={15} className="animate-spin" /> Sending…</>
            ) : (
              <>Respond Now <ChevronRight size={15} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmergencyAlert;