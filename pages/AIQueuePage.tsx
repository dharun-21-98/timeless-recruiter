import React, { useState, useMemo } from 'react';
import { Candidate, KanbanStatus, Page } from '../types';
import Modal from '../components/Modal';
import AIScreeningPanel from '../components/AIScreeningPanel';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { ScoreBadge } from '../components/CircularProgress';
import MeetingDetailsPanel from '../components/MeetingDetailsPanel';

interface AIQueuePageProps {
    candidates: Candidate[];
    setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
    onNavigate: (page: Page) => void;
}

const KanbanColumn: React.FC<{
    title: KanbanStatus;
    subtext: string;
    candidates: Candidate[];
    onCardClick: (candidate: Candidate) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, candidateId: number) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, status: KanbanStatus) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}> = ({ title, subtext, candidates, onCardClick, onDragStart, onDrop, onDragOver }) => (
    <div
        className="bg-slate-800/50 rounded-2xl p-4 flex-1 min-h-[300px] border border-slate-700/50"
        onDrop={(e) => onDrop(e, title)}
        onDragOver={onDragOver}
    >
        <div className="px-2 mb-4">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="text-sm text-slate-400">{subtext}</p>
        </div>
        <div className="space-y-4">
            {candidates.map(candidate => (
                <div
                    key={candidate.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, candidate.id)}
                    onClick={() => onCardClick(candidate)}
                >
                    <CandidateCard candidate={candidate} />
                </div>
            ))}
        </div>
    </div>
);

const CandidateCard: React.FC<{ candidate: Candidate }> = ({ candidate }) => (
    <div className="bg-slate-700/40 p-4 rounded-xl border border-slate-600 cursor-pointer transition-all duration-200 hover:bg-slate-700/80 hover:border-cyan-500/50">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-semibold text-white">{candidate.name}</h3>
                <p className="text-xs text-cyan-400">{candidate.designation}</p>
            </div>
             <div className={`px-2 py-0.5 text-xs rounded-full ${
                    candidate.source === 'LinkedIn' ? 'bg-blue-500/20 text-blue-300' :
                    candidate.source === 'Naukri Gulf' ? 'bg-orange-500/20 text-orange-300' :
                    'bg-indigo-500/20 text-indigo-300'
                }`}>{candidate.source}</div>
        </div>
        <div className="mt-4 text-xs text-slate-400 space-y-1">
            <p>{candidate.email}</p>
            <p>{candidate.phone}</p>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-600/50 flex justify-end">
            <ScoreBadge score={candidate.aiScore} />
        </div>
    </div>
);


const AIQueuePage: React.FC<AIQueuePageProps> = ({ candidates, setCandidates, onNavigate }) => {
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

    const columns = useMemo(() => ({
        [KanbanStatus.NEW]: candidates.filter(c => c.status === KanbanStatus.NEW),
        [KanbanStatus.REVIEW]: candidates.filter(c => c.status === KanbanStatus.REVIEW),
        [KanbanStatus.SCHEDULED]: candidates.filter(c => c.status === KanbanStatus.SCHEDULED),
    }), [candidates]);

    const handleCardClick = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
    };

    const handleCloseModal = () => {
        setSelectedCandidate(null);
    };

    const handleCandidateUpdate = (updatedCandidate: Candidate) => {
        setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
        handleCloseModal();
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, candidateId: number) => {
        e.dataTransfer.setData('candidateId', candidateId.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: KanbanStatus) => {
        const candidateId = parseInt(e.dataTransfer.getData('candidateId'));
        setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };


    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onNavigate('landing')}
                            className="flex items-center gap-2 text-sm font-semibold text-cyan-300 bg-slate-800/80 backdrop-blur-sm ring-1 ring-cyan-500/30 hover:ring-cyan-500 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-slate-900/50"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Queue</h1>
                            <p className="text-slate-400">Manage your talent pipeline with AI-driven insights.</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                    <KanbanColumn
                        title={KanbanStatus.NEW}
                        subtext="Pending AI screening"
                        candidates={columns[KanbanStatus.NEW]}
                        onCardClick={handleCardClick}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    />
                    <KanbanColumn
                        title={KanbanStatus.REVIEW}
                        subtext="AI screened • Awaiting decision"
                        candidates={columns[KanbanStatus.REVIEW]}
                        onCardClick={handleCardClick}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    />
                    <KanbanColumn
                        title={KanbanStatus.SCHEDULED}
                        subtext="Interview confirmed"
                        candidates={columns[KanbanStatus.SCHEDULED]}
                        onCardClick={handleCardClick}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    />
                </div>
            </div>
            <Modal isOpen={!!selectedCandidate} onClose={handleCloseModal}>
                {selectedCandidate && (
                    selectedCandidate.status === KanbanStatus.SCHEDULED ? (
                        <MeetingDetailsPanel 
                            candidate={selectedCandidate}
                            onClose={handleCloseModal}
                        />
                    ) : (
                        <AIScreeningPanel 
                            candidate={selectedCandidate}
                            onUpdate={handleCandidateUpdate}
                            onClose={handleCloseModal}
                        />
                    )
                )}
            </Modal>
        </div>
    );
};

export default AIQueuePage;
