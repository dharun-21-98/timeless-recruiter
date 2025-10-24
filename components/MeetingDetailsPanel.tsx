import React, { useState } from 'react';
import { Candidate } from '../types';
import { UserIcon } from './icons/UserIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { ClockIcon } from './icons/ClockIcon';
import { UsersIcon } from './icons/UsersIcon';
import { LinkIcon } from './icons/LinkIcon';

const MeetingDetailsPanel: React.FC<{ candidate: Candidate; onClose: () => void; }> = ({ candidate, onClose }) => {
    const [copied, setCopied] = useState(false);
    const meetingLink = "https://meet.google.com/xyz-abc-def";

    const handleCopyLink = () => {
        navigator.clipboard.writeText(meetingLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-lg bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
             <div className="flex items-start justify-between border-b border-slate-700 pb-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Interview with {candidate.name}</h2>
                    <p className="text-sm text-cyan-400">{candidate.designation}</p>
                </div>
                <div className="flex-shrink-0 p-2 bg-slate-700 rounded-full">
                    <UserIcon className="w-5 h-5 text-cyan-400" />
                </div>
            </div>

            <div className="space-y-5">
                <InfoRow icon={<CalendarIcon className="w-5 h-5 text-slate-400"/>} label="Date & Time" value="Tomorrow, 11:30 AM" />
                <InfoRow icon={<ClockIcon className="w-5 h-5 text-slate-400"/>} label="Duration" value="45 minutes" />
                <InfoRow icon={<UsersIcon className="w-5 h-5 text-slate-400"/>} label="Interviewers" value="Sarah Chen (Hiring Manager), Tom Evans (Team Lead)" />
                
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <LinkIcon className="w-5 h-5 text-slate-400"/>
                        <span className="text-sm font-medium text-slate-300">Meeting Link</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={meetingLink}
                            className="w-full bg-slate-700/50 text-slate-300 rounded-md px-3 py-1.5 border border-slate-600 text-sm"
                        />
                        <button onClick={handleCopyLink} className="text-sm font-semibold bg-cyan-600 hover:bg-cyan-700 text-white rounded-md px-3 py-1.5 transition whitespace-nowrap">
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>
            </div>

             <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row gap-4">
                <button className="flex-1 font-semibold text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-md px-4 py-2.5 transition">
                    Reschedule
                </button>
                <button className="flex-1 font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-md px-4 py-2.5 transition">
                    Cancel Interview
                </button>
            </div>
        </div>
    );
};

const InfoRow: React.FC<{icon: React.ReactNode, label: string, value: string}> = ({icon, label, value}) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div>
            <p className="text-sm font-medium text-slate-300">{label}</p>
            <p className="text-base text-white">{value}</p>
        </div>
    </div>
);


export default MeetingDetailsPanel;
