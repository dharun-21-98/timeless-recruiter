import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="text-center">
        <h1 className="font-bold text-3xl md:text-4xl font-display tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Timeless AI</span>
          <span className="text-slate-400"> Hire</span>
        </h1>
    </div>
  );
};

export default Logo;
