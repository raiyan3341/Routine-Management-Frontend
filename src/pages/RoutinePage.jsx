import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';

const timeSlots = ["8:00 - 9:20", "9:30 - 10:50", "11:00 - 12:30", "1:00 - 2:20", "2:30 - 3:50", "4:00 - 5:20"];
const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const RoutinePage = () => {
    const [routine, setRoutine] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchRoutine = () => {
        fetch('http://localhost:3000/routine')
            .then(res => res.json())
            .then(data => setRoutine(data));
    };

    useEffect(() => {
        fetchRoutine();
    }, []);

    const handleQuickDelete = async (day, slotIndex) => {
        if (!window.confirm(`Delete this class?`)) return;
        try {
            const response = await fetch('http://localhost:3000/routine', {
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
        <div className="min-h-screen bg-[#0f172a] p-2 md:p-8 text-slate-200">
            <h1 className="text-xl md:text-3xl font-extrabold text-center mb-6 text-cyan-400 tracking-tighter">
                Academic Schedule <span className="text-white opacity-50 font-light">| Spring 2026</span>
            </h1>

            <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-2xl bg-[#1e293b]">
                <table className="w-full border-collapse min-w-[800px] md:min-w-full">
                    <thead>
                        <tr className="bg-[#0f172a]">
                            <th className="border-b border-r border-slate-700 p-3 text-cyan-500 text-xs md:text-sm uppercase font-black">Day</th>
                            {timeSlots.map(slot => (
                                <th key={slot} className="border-b border-slate-700 p-3 text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">{slot}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {days.map(day => (
                            <tr key={day} className="hover:bg-[#1e293b] transition-colors border-b border-slate-700/50">
                                <td className="bg-[#0f172a] text-cyan-100 font-bold border-r border-slate-700 p-2 md:p-4 text-xs md:text-sm text-center sticky left-0 z-10 shadow-lg">
                                    {day.slice(0, 3)}
                                </td>
                                {timeSlots.map((_, index) => {
                                    const dayData = routine.find(r => r.day === day);
                                    const cell = dayData?.slots?.[index];

                                    return (
                                        <td key={index} className="p-1 md:p-2 min-w-[120px] md:min-w-[150px] relative group border-r border-slate-700/30">
                                            {cell ? (
                                                <div className="bg-[#334155] p-2 rounded-lg border border-cyan-500/30 shadow-inner h-full flex flex-col justify-center items-center text-center">
                                                    {user && (
                                                        <button 
                                                            onClick={() => handleQuickDelete(day, index)}
                                                            className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[10px] z-20"
                                                        >✕</button>
                                                    )}
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <span className="text-cyan-300 font-black text-[10px] md:text-[12px] uppercase">{cell.subject}</span>
                                                        <span className="text-yellow-500 font-mono text-[10px] md:text-[12px] bg-black/30 px-1 rounded">({cell.code})</span>
                                                    </div>
                                                    <div className="text-[10px] md:text-[12px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                        ROOM: {cell.room}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full flex items-center justify-center opacity-10 py-4">
                                                    <div className="w-1 h-1 rounded-full bg-slate-500"></div>
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
            
            <p className="text-center text-slate-500 text-[10px] mt-4 uppercase tracking-[0.2em]">
                System Status: <span className="text-emerald-500">Online</span>
            </p>
        </div>
    );
};

export default RoutinePage;