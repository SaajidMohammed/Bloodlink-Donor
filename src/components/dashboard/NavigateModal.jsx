import React, { useState } from 'react';
import { MapPin, Navigation, X, Loader2, Building2, Map } from 'lucide-react';

const NavigateModal = ({ request, onClose }) => {
    const [locating, setLocating] = useState(false);

    const hospitalName =
        request?.requester_name ||
        request?.hospital?.hospital_name ||
        request?.created_by?.hospital_name ||
        'Hospital';

    const city = request?.city || '';
    const address = request?.hospital_location || city;
    const destination = encodeURIComponent(`${hospitalName} ${address}`);

    const handleStartMoving = () => {
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
            openMaps(); // fallback – no geolocation support
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                openMaps(`${latitude},${longitude}`);
            },
            () => {
                // Permission denied or error — open with destination only
                openMaps();
            },
            { timeout: 8000 }
        );
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Panel */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-[slideUp_0.25s_ease-out]">

                {/* Header */}
                <div className="bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-5 flex items-center gap-3">
                    <div className="h-10 w-10 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                        <Map size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-rose-200 text-[10px] font-black uppercase tracking-widest">Navigate To</p>
                        <h2 className="text-white font-black text-base leading-tight truncate">{hospitalName}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors shrink-0"
                    >
                        <X size={16} className="text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">

                    {/* Location info */}
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 bg-rose-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                <Building2 size={15} className="text-rose-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hospital</p>
                                <p className="font-bold text-slate-800 text-sm">{hospitalName}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                {/* Pulsing pin */}
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                    <MapPin size={12} className="relative text-blue-600" />
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                                <p className="font-bold text-slate-800 text-sm">{address || 'Address not specified'}</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 text-center">
                        Your browser will ask for location permission to calculate the route.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleStartMoving}
                            disabled={locating}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95"
                        >
                            {locating ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    Locating…
                                </>
                            ) : (
                                <>
                                    <Navigation size={15} />
                                    Start Moving
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigateModal;
