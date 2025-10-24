import React from 'react';

interface CircularProgressProps {
    score: number;
    className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ score, className }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 10) * circumference;

    const getColor = () => {
        if (score >= 9) return 'stroke-green-400';
        if (score >= 8) return 'stroke-cyan-400';
        if (score >= 7) return 'stroke-yellow-400';
        return 'stroke-orange-400';
    };
    
    const getTextAndBgColor = () => {
        if (score >= 9) return 'text-green-300 bg-green-500/10';
        if (score >= 8) return 'text-cyan-300 bg-cyan-500/10';
        if (score >= 7) return 'text-yellow-300 bg-yellow-500/10';
        return 'text-orange-300 bg-orange-500/10';
    };


    return (
        <div className={`relative w-24 h-24 flex items-center justify-center ${className}`}>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                    className="stroke-slate-700"
                    strokeWidth="8"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className={`transition-all duration-1000 ease-in-out ${getColor()}`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
            </svg>
            <span className={`absolute text-2xl font-bold ${getTextAndBgColor().split(' ')[0]}`}>
                {score.toFixed(1)}
            </span>
        </div>
    );
};

export const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
     const getTextAndBgColor = () => {
        if (score >= 9) return 'text-green-300 bg-green-500/20';
        if (score >= 8) return 'text-cyan-300 bg-cyan-500/20';
        if (score >= 7) return 'text-yellow-300 bg-yellow-500/20';
        return 'text-orange-300 bg-orange-500/20';
    };

    return (
        <div className={`px-2 py-1 text-xs font-semibold rounded-full ${getTextAndBgColor()}`}>
            Score: {score.toFixed(1)}
        </div>
    )
}

export default CircularProgress;
