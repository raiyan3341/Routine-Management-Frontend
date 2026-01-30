import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#0f172a] border-t border-slate-800/60 py-6">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col items-center justify-center space-y-4">
                    
                    {/* Copyright Info */}
                    <div className="text-center">
                        <p className="text-[10px] md:text-xs text-slate-500 tracking-wide">
                            © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">Routine Management System</span>. 
                            All rights reserved.
                        </p>
                    </div>

                    {/* Developer Credit - Professional Badge Style */}
                    <div className="flex items-center gap-2 group cursor-default">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-slate-200 font-medium">
                            Developed by
                        </span>
                        <div className="h-[1px] w-4 bg-slate-700 group-hover:w-6 transition-all duration-300"></div>
                        <div className="px-3 py-1 bg-slate-800/40 border border-slate-700/50 rounded-full flex items-center gap-2 hover:border-cyan-500/50 transition-colors shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></span>
                            <span className="text-[11px] md:text-xs font-bold text-green-400 tracking-tight">
                                RAIYAN SHEIKH
                            </span>
                        </div>
                    </div>

                    {/* Subtle Tagline */}
                    <p className="text-[9px] text-slate-700 font-light italic">
                        Version 2.0.4 | Optimized for Performance
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;