import React from 'react';
import { Page } from '../types';
import Logo from '../components/Logo';

interface LandingPageProps {
    onNavigate: (page: Page) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <div className="max-w-3xl">
                <div className="mb-8">
                    <Logo />
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Welcome to Timeless AI Recruitment Platform
                </h2>
                <p className="text-lg md:text-xl text-slate-400 mb-12">
                    Experience the next-gen AI-powered hiring intelligence.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button
                        onClick={() => onNavigate('analyzer')}
                        className="w-full sm:w-auto font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 rounded-xl px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
                    >
                        Start Resume Analyzer
                    </button>
                    <button
                        onClick={() => onNavigate('queue')}
                        className="w-full sm:w-auto font-semibold text-cyan-300 bg-slate-800/80 backdrop-blur-sm ring-1 ring-cyan-500/30 hover:ring-cyan-500 rounded-xl px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-slate-900/50"
                    >
                        View AI Queue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
