import React, { useState } from 'react';
import { MapPin, Navigation, X, Loader2, Building2, Map as MapIcon } from 'lucide-react';

const HospitalMap = ({ hospital, onClose }) => {
    const [locating, setLocating] = useState(false);

    const hospitalName = hospital?.hospital_name || hospital?.requester_name || 'Hospital';
    const city = hospital?.city || '';
    const address = hospital?.hospital_location || city;
    const destination = encodeURIComponent(`${hospitalName} ${address}`);

    const handleNavigate = () => {
        setLocating(true);

        const openMaps = (origin = '') => {
            const url = origin
                ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
                : `https://www.google.com/maps/search/?api=1&query=${destination}`;
            window.open(url, '_blank', 'noopener,noreferrer');
            setLocating(false);
            onClose();
        };

        if (!navigator.geolocation) {
            openMaps();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                openMaps(`${latitude},${longitude}`);
            },
            () => {
                openMaps();
            },
            { timeout: 8000 }
        );
    };

    // Embed Google Maps iframe (using Place Search API placeholder style)
    const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyA_NOT_A_REAL_KEY&q=${destination}`;
    // Since I don't have a real API key, I'll use a standard search URL for the iframe alternatively 
    // or just show a nice placeholder if embed fails without key.
    // However, most modern browsers allow simple search embeds or we can use a static map style look.

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-[slideUp_0.25s_ease-out]">

                {/* Header */}
                <div className="bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-5 flex items-center gap-3">
                    <div className="h-10 w-10 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                        <MapIcon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-rose-200 text-[10px] font-black uppercase tracking-widest">Hospital Location</p>
                        <h2 className="text-white font-black text-base leading-tight truncate">{hospitalName}</h2>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors shrink-0">
                        <X size={16} className="text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Map Placeholder/Iframe Area */}
                    <div className="aspect-video w-full bg-slate-100 rounded-2xl overflow-hidden relative shadow-inner border border-slate-200">
                        <iframe
                            title="Hospital Map"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${destination}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="h-10 w-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                                <MapPin size={20} className="text-rose-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</p>
                                <p className="font-bold text-slate-800 text-sm line-clamp-2">{address}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleNavigate}
                            disabled={locating}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95 shrink-0 w-full sm:w-auto"
                        >
                            {locating ? (
                                <><Loader2 size={15} className="animate-spin" /> Calculating...</>
                            ) : (
                                <><Navigation size={15} /> Navigate</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalMap;
