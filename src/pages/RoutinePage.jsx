import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';

const timeSlots = ["8:00 - 9:20", "9:30 - 10:50", "11:00 - 12:30", "1:00 - 2:20", "2:30 - 3:50", "4:00 - 5:20"];
const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const RoutinePage = () => {
    const [routine, setRoutine] = useState([]);
    const [stats, setStats] = useState({ totalClasses: 0, lastUpdate: "Loading..." });
    const [selectedSlot, setSelectedSlot] = useState(null); 
    const { user } = useContext(AuthContext);

    const fetchRoutine = () => {
        fetch('https://routine-management-backend.vercel.app/routine')
            .then(res => res.json())
            .then(data => {
                setRoutine(data);
                calculateStats(data);
            });
    };

    const calculateStats = (data) => {
        let count = 0;
        data.forEach(dayDoc => {
            if (dayDoc.slots) {
                Object.values(dayDoc.slots).forEach(slot => { if (slot) count++; });
            }
        });
        setStats({
            totalClasses: count,
            lastUpdate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    };

    useEffect(() => {
        fetchRoutine();
    }, []);

    
    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedData = {
            day: selectedSlot.day,
            slotIndex: selectedSlot.index,
            subject: formData.get('subject'),
            code: formData.get('code'),
            room: formData.get('room')
        };

        try {
            const response = await fetch('https://routine-management-backend.vercel.app/routine', {
                method: 'PATCH', 
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (response.ok) {
                fetchRoutine();
                setSelectedSlot(null);
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this class?")) return;
        try {
            await fetch('https://routine-management-backend.vercel.app/routine', {
                method: 'DELETE',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ day: selectedSlot.day, slotIndex: selectedSlot.index })
            });
            fetchRoutine();
            setSelectedSlot(null);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="min-h-screen bg-[#020617] p-2 md:p-6 text-slate-300 font-sans pb-10">
            {/* Header */}
            <div className="text-center mb-6 mt-4">
                <h1 className="text-xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tighter uppercase italic">
                    Northern University Bangladesh
                </h1>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Spring Semester 2026</p>
            </div>

            {/* Routine Table */}
            <div className="relative group max-w-[1200px] mx-auto overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a]/60 backdrop-blur-xl shadow-2xl">
                <div className="max-h-[90vh] overflow-auto">
                    <table className="w-full border-collapse table-fixed min-w-[600px] md:min-w-full">
                        <thead>
                            <tr className="bg-[#1e293b]/80 sticky top-0 z-30">
                                <th className="sticky left-0 top-0 z-40 bg-[#1e293b] border-b border-r border-slate-700 p-2 text-cyan-400 text-[9px] md:text-xs uppercase font-black w-12 md:w-24">Day</th>
                                {timeSlots.map(slot => (
                                    <th key={slot} className="border-b border-slate-700 p-2 text-[10px] md:text-[12px] text-slate-300 font-black uppercase tracking-tighter">{slot}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {days.map(day => (
                                <tr key={day} className="border-b border-slate-800/50 hover:bg-white/[0.01]">
                                    <td className="bg-[#1e293b]/50 text-white font-bold border-r border-slate-700 p-1.5 text-[9px] md:text-xs text-center sticky left-0 z-20 backdrop-blur-md italic">{day.slice(0, 3)}</td>
                                    {timeSlots.map((_, index) => {
                                        const dayData = routine.find(r => r.day === day);
                                        const cell = dayData?.slots?.[index];
                                        
                                        return (
                                            <td key={index} 
                                               
                                                onClick={() => user && setSelectedSlot({ ...(cell || {subject: '', code: '', room: ''}), day, index })}
                                                className={`p-[2px] md:p-1 relative border-r border-slate-800/30 h-11 md:h-20 ${user ? 'cursor-pointer hover:bg-cyan-500/5' : ''}`}
                                            >
                                                {cell ? (
                                                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-1 md:p-2 rounded border border-slate-700 hover:border-cyan-500/50 transition-all flex flex-col items-center h-full justify-center">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-cyan-400 font-black text-[8px] md:text-[11px] uppercase truncate w-full text-center">{cell.subject}</span>
                                                        <span className="text-yellow-500 font-mono text-[8px] md:text-[9px]">({cell.code})</span>
                                                        </div>
                                                        <span className="text-emerald-400 font-bold text-[7px] md:text-[9px] mt-1 text-center">ROOM: {cell.room}</span>
                                                    </div>
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center opacity-10">
                                                        <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
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
            </div>

            {/* Dynamic Stats Cards */}
            <div className="max-w-[1200px] mx-auto mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 px-2">
                <StatCard label="Total Classes" value={stats.totalClasses} sub="Weekly" />
                <StatCard label="Server Status" value="Live" color="text-emerald-400" pulse />
                <StatCard label="Last Update" value={stats.lastUpdate} />
                <StatCard label="Access Level" value={user ? 'Admin' : 'Student'} color={user ? 'text-cyan-400' : 'text-blue-500'} />
            </div>

            {/* Modal */}
            {selectedSlot && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0f172a] border border-cyan-500/30 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                            <h2 className="text-cyan-400 font-black uppercase text-sm italic">
                                {selectedSlot.subject ? 'Edit Class' : 'Add New Class'}
                            </h2>
                            <button onClick={() => setSelectedSlot(null)} className="text-slate-500 hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Subject Name</label>
                                <input name="subject" defaultValue={selectedSlot.subject} placeholder="e.g. Algorithms" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:border-cyan-500 outline-none text-white" required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Teacher Code</label>
                                    <input name="code" defaultValue={selectedSlot.code} placeholder="e.g. MRA" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:border-cyan-500 outline-none text-white" required />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Room No</label>
                                    <input name="room" defaultValue={selectedSlot.room} placeholder="e.g. 602" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:border-cyan-500 outline-none text-white" required />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded text-xs uppercase transition-all shadow-lg shadow-cyan-500/20">
                                    {selectedSlot.subject ? 'Update Class' : 'Save Class'}
                                </button>
                                {selectedSlot.subject && (
                                    <button type="button" onClick={handleDelete} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold px-4 py-2 rounded text-[10px] uppercase border border-red-500/20 transition-all">
                                        Delete
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, sub, color = "text-white", pulse }) => (
    <div className="bg-[#0f172a] border border-slate-800 p-3 rounded-xl shadow-lg">
        <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-center gap-2">
            {pulse && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>}
            <h3 className={`text-sm md:text-xl font-black ${color} tracking-tighter`}>
                {value} {sub && <span className="text-[10px] text-slate-600 ml-1">{sub}</span>}
            </h3>
        </div>
    </div>
);

export default RoutinePage;