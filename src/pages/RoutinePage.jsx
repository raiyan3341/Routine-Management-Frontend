import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';

const timeSlots = ["8:00 - 9:20", "9:30 - 10:50", "11:00 - 12:30", "1:00 - 2:20", "2:30 - 3:50", "4:00 - 5:20"];
const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const RoutinePage = () => {
    const [routine, setRoutine] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchRoutine = () => {
        fetch('https://routine-management-backend.vercel.app/routine')
            .then(res => res.json())
            .then(data => setRoutine(data));
    };

    useEffect(() => {
        fetchRoutine();
    }, []);

    const handleQuickDelete = async (day, slotIndex) => {
        if (!window.confirm(`Delete this class?`)) return;
        try {
            const response = await fetch('https://routine-management-backend.vercel.app/routine', {
                method: 'DELETE',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ day, slotIndex })
            });
            const result = await response.json();
            if (result.modifiedCount > 0) fetchRoutine();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] p-1 md:p-4 text-slate-200">
            <h1 className="text-lg md:text-3xl font-extrabold text-center mb-9 mt-8 text-cyan-400 tracking-tighter">
                Academic Schedule <span className="text-white opacity-50 font-light md:text-3xl">| Spring 2026</span>
            </h1>

            {/* Container with rounded corners and overflow control */}
            <div className="max-h-[80vh] overflow-auto rounded-lg border border-slate-700 shadow-2xl bg-[#1e293b]">
                <table className="w-full border-collapse table-fixed min-w-[650px] md:min-w-full">
                    <thead>
                        <tr className="bg-[#0f172a] sticky top-0 z-30 shadow-md">
                            {/* Sticky Top-Left Corner */}
                            <th className="sticky left-0 top-0 z-40 bg-[#0f172a] border-b border-r border-slate-700 p-2 text-cyan-500 text-[10px] md:text-xs uppercase font-black w-12 md:w-20">
                                Day
                            </th>
                            {timeSlots.map(slot => (
                                <th key={slot} className="border-b border-slate-700 p-2 text-[9px] md:text-[11px] text-slate-400 font-bold uppercase tracking-tighter bg-[#0f172a]">
                                    {slot}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {days.map(day => (
                            <tr key={day} className="hover:bg-[#1e293b] transition-colors border-b border-slate-700/30">
                                {/* Sticky Side Column (Days) */}
                                <td className="bg-[#0f172a] text-cyan-100 font-bold border-r border-slate-700 p-1.5 text-[10px] md:text-xs text-center sticky left-0 z-20 shadow-sm">
                                    {day.slice(0, 3)}
                                </td>
                                
                                {timeSlots.map((_, index) => {
                                    const dayData = routine.find(r => r.day === day);
                                    const cell = dayData?.slots?.[index];

                                    return (
                                        <td key={index} className="p-0.5 md:p-1 relative group border-r border-slate-700/20">
                                            {cell ? (
                                                <div className="bg-[#334155] p-1 md:p-2 rounded border border-cyan-500/20 shadow-inner h-full flex flex-col justify-center items-center text-center min-h-[50px] md:min-h-[70px]">
                                                    {user && (
                                                        <button 
                                                            onClick={() => handleQuickDelete(day, index)}
                                                            className="absolute top-0.5 right-0.5 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[8px] z-20"
                                                        >✕</button>
                                                    )}
                                                    <div className="flex flex-col items-center gap-0">
                                                        <span className="text-cyan-300 font-black text-[9px] md:text-[11px] uppercase leading-tight">{cell.subject}</span>
                                                        <span className="text-yellow-500 font-mono text-[8px] md:text-[10px] bg-black/30 px-1 rounded my-0.5">({cell.code})</span>
                                                    </div>
                                                    <div className="text-[8px] md:text-[9px] text-emerald-400 font-bold bg-emerald-500/5 px-1 py-0 rounded border border-emerald-500/10 mt-1">
                                                        R: {cell.room}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full flex items-center justify-center opacity-5 py-4">
                                                    <div className="w-0.5 h-0.5 rounded-full bg-slate-500"></div>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <p className="text-center text-slate-600 text-[10px] md:text-[10px] mt-3 uppercase tracking-widest">
                System Status: <span className="text-emerald-600/80">Active</span>
            </p>
        </div>
    );
};

export default RoutinePage;