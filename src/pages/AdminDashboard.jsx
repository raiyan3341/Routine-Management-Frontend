import React from 'react';

const timeSlots = ["8:00 AM - 9:20 AM", "9:30 AM - 10:50 AM", "11:00 AM - 12:30 PM", "1:00 PM - 2:20 PM", "2:30 PM - 3:50 PM", "4:00 PM - 5:20 PM"];
const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const AdminDashboard = () => {

    const handleAction = async (e, type) => {
        e.preventDefault();
        const form = e.target.form;
        
        const day = form.day.value;
        const slotIndex = form.slot.value;

        if (type === 'delete') {
            if (!window.confirm("Are you sure you want to delete this class?")) return;

            const response = await fetch('http://localhost:3000/routine', {
                method: 'DELETE',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ day, slotIndex })
            });
            const result = await response.json();
            if (result.modifiedCount > 0) {
                alert("Deleted Successfully! 🗑️");
                form.reset();
            }
            return;
        }

        const updateData = {
            day,
            slotIndex,
            subject: form.subject.value,
            code: form.code.value,
            room: form.room.value,
        };

        if(!updateData.subject || !updateData.code || !updateData.room) {
            alert("Please fill all fields for update!");
            return;
        }

        const response = await fetch('http://localhost:3000/routine', {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        const result = await response.json();
        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
            alert("Routine Updated! ✅");
            form.reset();
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] p-4 md:p-10 text-slate-200">
            <div className="max-w-3xl mx-auto bg-[#1e293b]/50 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-slate-700 shadow-2xl">
                
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                        Control <span className="text-cyan-500 text-glow">Panel</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-2 uppercase tracking-widest font-semibold opacity-60">Routine Management System</p>
                </div>
                
                <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Day Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-cyan-500 ml-1">Select Day</label>
                        <select name="day" className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-xl focus:border-cyan-500 outline-none transition-all text-white font-bold cursor-pointer hover:bg-[#161e31]">
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    {/* Slot Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-cyan-500 ml-1">Time Slot</label>
                        <select name="slot" className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-xl focus:border-cyan-500 outline-none transition-all text-white font-bold cursor-pointer hover:bg-[#161e31]">
                            {timeSlots.map((s, i) => <option key={s} value={i}>{s}</option>)}
                        </select>
                    </div>

                    {/* Input Fields */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0f172a]/50 p-6 rounded-2xl border border-slate-800/50">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Subject</label>
                            <input name="subject" placeholder="e.g. CSE-101" className="w-full bg-[#1e293b] border border-slate-700 p-3 rounded-lg focus:ring-1 ring-cyan-500 outline-none text-white placeholder:text-slate-600" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Teacher Code</label>
                            <input name="code" placeholder="e.g. AMF" className="w-full bg-[#1e293b] border border-slate-700 p-3 rounded-lg focus:ring-1 ring-cyan-500 outline-none text-white placeholder:text-slate-600" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Room No</label>
                            <input name="room" placeholder="e.g. 404" className="w-full bg-[#1e293b] border border-slate-700 p-3 rounded-lg focus:ring-1 ring-cyan-500 outline-none text-white placeholder:text-slate-600" />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mt-4">
                        <button 
                            onClick={(e) => handleAction(e, 'update')}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest"
                        >
                            Update Schedule
                        </button>
                        
                        <button 
                            onClick={(e) => handleAction(e, 'delete')}
                            className="flex-1 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white font-black py-4 rounded-xl transition-all hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest"
                        >
                            Delete Slot 🗑️
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="mt-10 text-center">
                <p className="text-[10px] text-slate-600 uppercase tracking-[0.4em] font-bold">Secure Admin Access Only</p>
            </div>
        </div>
    );
};

export default AdminDashboard;