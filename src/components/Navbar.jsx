import { useContext, useState } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "./context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const navLinkStyles = ({ isActive }) => 
        `px-4 py-2 rounded-lg transition-all duration-300 ${
            isActive ? "text-cyan-400 bg-cyan-400/10 font-bold" : "text-slate-300 hover:text-white hover:bg-slate-800"
        }`;

    return (
        <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 shadow-xl">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex justify-between items-center h-14">
                    
                    {/* Logo Area */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:rotate-12 transition-transform">
                            <span className="text-white font-black text-xl">R</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                           Class <span className="text-cyan-500">Routine</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        <NavLink to="/" className={navLinkStyles}>Home</NavLink>
                        
                        {user ? (
                            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
                                <NavLink to="/admin" className={navLinkStyles}>Dashboard</NavLink>
                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</span>
                                </div>
                                <button 
                                    onClick={() => logout()} 
                                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-sm font-bold px-5 py-2 rounded-lg border border-red-500/20 transition-all duration-300 shadow-lg shadow-red-500/10"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold px-6 py-2 rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all hover:-translate-y-0.5"
                            >
                                Admin Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                        </svg>
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2 border-t border-slate-800 mt-2">
                        <Link to="/" className="block px-4 py-3  text-slate-300 hover:bg-slate-800 rounded-lg">Home</Link>
                        {user ? (
                            <>
                                <Link to="/admin" className="block px-4 py-3 text-cyan-400 font-bold">Dashboard</Link>
                                <button onClick={() => logout()} className="w-full text-left px-4 py-3 text-red-400 font-bold">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="block px-1 py-2 w-50 bg-cyan-600 text-white text-center rounded-lg mx-4 mt-2 font-bold">Admin Login</Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;