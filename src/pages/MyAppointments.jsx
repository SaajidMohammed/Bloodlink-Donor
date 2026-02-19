import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Calendar, Clock, MapPin, CheckCircle2, Timer } from 'lucide-react';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data } = await axiosInstance.get('/donor/my-appointments');
      setAppointments(data);
    };
    fetchAppointments();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">Your Scheduled Visits</h2>
      
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No appointments found.</p>
          </div>
        ) : (
          appointments.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${app.status === 'UPCOMING' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                  {app.status === 'UPCOMING' ? <Timer size={24} /> : <CheckCircle2 size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{app.hospital_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <Calendar size={14} /> {new Date(app.appointment_time).toLocaleDateString()}
                    <Clock size={14} className="ml-2" /> {new Date(app.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin size={16} /> {app.city}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppointments;