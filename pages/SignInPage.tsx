import React, { useState } from 'react';
import Logo from '../components/Logo';

interface SignInPageProps {
    onLoginSuccess: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('admin@timeless.ai');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin@timeless.ai' && password === 'admin123') {
            setError('');
            onLoginSuccess();
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-slate-900">
            <div className="w-full max-w-md">
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl blur opacity-25"></div>
                    <div className="relative bg-slate-800/80 backdrop-blur-sm ring-1 ring-white/10 rounded-2xl p-8 shadow-2xl shadow-slate-900/50">
                        <div className="mb-8 text-center">
                            <Logo />
                            <p className="text-slate-400 mt-2">AI-Powered Recruitment Command Center</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="email"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-700/50 text-white rounded-md px-4 py-2 border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-700/50 text-white rounded-md px-4 py-2 border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 rounded-md px-4 py-3 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
