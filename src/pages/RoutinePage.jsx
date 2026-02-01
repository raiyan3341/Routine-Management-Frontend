import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

// --- PDF Download Logic (Landscape - Single Page Optimized) ---
const downloadPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); 
    
    // Header Height komano hoyeche space bachanir jonno
    const headerHeight = 25; 
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 297, headerHeight, 'F');
    
    doc.setDrawColor(34, 211, 238); 
    doc.setLineWidth(0.5);
    doc.line(0, headerHeight, 297, headerHeight);

    doc.setTextColor(34, 211, 238); 
    doc.setFontSize(18); 
    doc.setFont("helvetica", "bold");
    doc.text("NORTHERN UNIVERSITY BANGLADESH", 148.5, 12, { align: 'center' });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("CLASS ROUTINE • SPRING 2026 • SECTION 7C", 148.5, 19, { align: 'center' });

    const tableColumn = ["DAY", ...timeSlots];
    const tableRows = days.map(day => {
        const dayData = routine.find(r => r.day === day);
        const row = [day.toUpperCase()];
        timeSlots.forEach((_, index) => {
            const cell = dayData?.slots?.[index];
            row.push(cell ? `${cell.subject} (${cell.code})\nROOM: ${cell.room}` : "-");
        });
        return row;
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: headerHeight + 5, // Header er thik nichei table shuru
        theme: 'grid',
        styles: { 
            fontSize: 8.5, // Font size thik rakha hoyeche jate porha jay
            halign: 'center', 
            valign: 'middle', 
            cellPadding: 3, // Vertical height komanor jonno padding adjust kora hoyeche
            font: 'helvetica',
            fontStyle: 'bold',
            lineWidth: 0.3,
            lineColor: [51, 65, 85],
            textColor: [0, 0, 0]
        },
        headStyles: { 
            fillColor: [15, 23, 42],
            textColor: [34, 211, 238], 
            fontSize: 9,
            lineWidth: 0.5,
        },
        columnStyles: {
            0: { 
                fillColor: [30, 41, 59], 
                textColor: [255, 255, 255], 
                cellWidth: 25,
                fontStyle: 'bold'
            }
        },
        // Row height control korar jonno cellPadding e shudhu vertical padding komano
        didParseCell: function(data) {
            if (data.section === 'body') {
                data.cell.styles.minCellHeight = 12; // Protiti row er minimum height control
            }
        },
        margin: { top: 10, bottom: 10, left: 10, right: 10 },
    });

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 10, doc.internal.pageSize.height - 5);

    doc.save(`NUB_Routine_7C.pdf`);
};

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
                                                        <div className="flex flex-col items-center gap-0.5">
                                                           <div className="flex gap-0.5 items-center">
                                                             <span className="text-cyan-400 font-black text-[8px] md:text-[11px] uppercase truncate w-full text-center">{cell.subject}</span>
                                                            <span className="text-yellow-500 font-mono text-[8px] md:text-[10px]">({cell.code})</span>
                                                           </div>
                                                        </div>
                                                        <span className="text-emerald-400 font-bold text-[7px] md:text-[9px] mt-1 text-center leading-none">ROOM: {cell.room}</span>
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

            {/* Download Button Section */}
            <div className="max-w-[1200px] mx-auto mt-10 flex justify-center pb-10">
    <button 
        onClick={downloadPDF}
        className="group relative flex items-center gap-4 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:border-cyan-400 hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)] overflow-hidden"
    >
        {/* Shimmer Effect Overlay */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        {/* Animated Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>

        {/* Icon with Animation */}
        <div className="relative flex items-center justify-center bg-cyan-500/10 p-2 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
        </div>

        {/* Text Content */}
        <div className="relative flex flex-col items-start">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] leading-none">Download PDF</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Ready for Print • PDF</span>
        </div>

        {/* Subtle Right Arrow that appears on hover */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </button>
</div>

            {/* Dynamic Stats Cards */}
            <div className="max-w-[1200px] mx-auto mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 px-2">
                <StatCard label="Total Classes" value={stats.totalClasses} sub="Weekly" />
                <StatCard label="Server Status" value="Live" color="text-emerald-400" pulse />
                <StatCard label="Last Update" value={stats.lastUpdate} />
                <StatCard label="Access Level" value={user ? 'Admin' : 'Student'} color={user ? 'text-cyan-400' : 'text-blue-500'} />
            </div>

            {/* Modal remains the same */}
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