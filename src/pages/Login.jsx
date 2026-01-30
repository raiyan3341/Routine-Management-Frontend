import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../components/context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        setError(""); 
        const email = e.target.email.value;
        const password = e.target.password.value;

        login(email, password)
            .then(() => {
                navigate("/admin");
            })
            .catch(err => {
                setError("Invalid Email or Password! Please try again.");
                console.log(err.message);
            });
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#0f172a] px-4 relative overflow-hidden">
            
            {/* Background Glow Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-md z-10">
                <form 
                    onSubmit={handleLogin} 
                    className="p-8 md:p-12 bg-[#1e293b]/40 backdrop-blur-xl rounded-[2rem] border border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-block p-4 bg-cyan-500/10 rounded-2xl mb-4 border border-cyan-500/20">
                            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                            Admin <span className="text-cyan-500">Login</span>
                        </h2>
                        <p className="text-slate-400 text-xs mt-2 font-bold tracking-[0.2em] opacity-60 uppercase">Authorized Personnel Only</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg mb-6 text-center animate-shake">
                            {error}
                        </div>
                    )}

                    {/* Inputs */}
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-cyan-500 uppercase ml-2">Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="admin@routinehub.com" 
                                className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 outline-none transition-all text-white font-medium" 
                                required 
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-cyan-500 uppercase ml-2">Secure Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="••••••••" 
                                className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 outline-none transition-all text-white font-medium" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <button className="w-full mt-10 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-xl shadow-[0_10px_30px_rgba(8,145,178,0.3)] transition-all hover:-translate-y-1 active:scale-[0.98] uppercase tracking-widest text-sm">
                        Access Dashboard
                    </button>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                            Built with Security & Speed
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;