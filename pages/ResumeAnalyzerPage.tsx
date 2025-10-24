import React, { useState, useMemo } from 'react';
import { Candidate, KanbanStatus, Page } from '../types';
import CircularProgress, { ScoreBadge } from '../components/CircularProgress';
import Modal from '../components/Modal';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { CheckIcon } from '../components/icons/CheckIcon';

interface ResumeAnalyzerPageProps {
    onNavigate: (page: Page) => void;
    candidates: Candidate[];
    setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
}

type AnalysisState = 'input' | 'analyzing' | 'results';

const ResumeAnalyzerPage: React.FC<ResumeAnalyzerPageProps> = ({ onNavigate, candidates, setCandidates }) => {
    const [state, setState] = useState<AnalysisState>('input');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [processedReviewCandidates, setProcessedReviewCandidates] = useState<number[]>([]);
    const [analysisResult, setAnalysisResult] = useState<{
        approved: Candidate[];
        forReview: Candidate[];
    } | null>(null);

    const { topCandidates, reviewCandidates } = useMemo(() => {
        const newSortedCandidates = candidates
            .filter(c => c.status === KanbanStatus.SOURCED)
            .sort((a, b) => b.aiScore - a.aiScore);
        return {
            topCandidates: newSortedCandidates.slice(0, 5),
            reviewCandidates: newSortedCandidates.slice(5, 8),
        };
    }, [candidates]);

    const startAnalysis = () => {
        setState('analyzing');
        setTimeout(() => {
            const approvedIds = topCandidates.map(c => c.id);
            
            setAnalysisResult({
                approved: topCandidates,
                forReview: reviewCandidates,
            });

            setCandidates(prev =>
                prev.map(c => (approvedIds.includes(c.id) ? { ...c, status: KanbanStatus.NEW } : c))
            );
            setState('results');
            setShowSuccessModal(true);
        }, 3000);
    };
    
    const handleMoveToNextLevel = (id: number) => {
        setCandidates(prev => prev.map(c => (c.id === id ? { ...c, status: KanbanStatus.NEW } : c)));
        setProcessedReviewCandidates(prev => [...prev, id]);
    };
    
    const handleSkipRemaining = () => {
        if (!analysisResult) return;
        const remainingIds = analysisResult.forReview
            .filter(c => !processedReviewCandidates.includes(c.id))
            .map(c => c.id);
        setProcessedReviewCandidates(prev => [...prev, ...remainingIds]);
    };

    const remainingToReview = analysisResult?.forReview.filter(c => !processedReviewCandidates.includes(c.id)) ?? [];
    const allReviewed = state === 'results' && analysisResult !== null && remainingToReview.length === 0;

    const renderState = () => {
        switch (state) {
            case 'input':
                return <InputState onStartAnalysis={startAnalysis} />;
            case 'analyzing':
                return <AnalyzingState />;
            case 'results':
                return (
                    <ResultsState 
                        approvedCandidates={analysisResult?.approved ?? []}
                        reviewCandidates={remainingToReview}
                        onMoveToNextLevel={handleMoveToNextLevel}
                        onSkipRemaining={handleSkipRemaining}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => onNavigate('landing')}
                        className="flex items-center gap-2 text-sm font-semibold text-cyan-300 bg-slate-800/80 backdrop-blur-sm ring-1 ring-cyan-500/30 hover:ring-cyan-500 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-slate-900/50"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Resume Analyzer</h1>
                        <p className="text-slate-400">Let our AI find the best-fit candidates for your job role.</p>
                    </div>
                </div>

                {renderState()}
                 {allReviewed && (
                    <div className="text-center mt-12">
                        <button
                            onClick={() => onNavigate('queue')}
                            className="font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 rounded-xl px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
                        >
                           Go to AI Queue
                        </button>
                    </div>
                )}
            </div>
            <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
        </div>
    );
};

const InputState: React.FC<{ onStartAnalysis: () => void }> = ({ onStartAnalysis }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Paste Job Description</h2>
            <textarea
                className="w-full h-48 bg-slate-700/50 text-white rounded-md p-4 border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition resize-none"
                placeholder="Paste the full job description here..."
                onChange={e => { if (e.target.value.length > 100) onStartAnalysis(); }}
            ></textarea>
            <p className="text-xs text-slate-500 mt-2 text-right">Minimum 100 characters to start analysis.</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-white mb-4">Upload Job Description File</h2>
            <label className="w-full cursor-pointer bg-slate-700/50 hover:bg-slate-700 border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center transition">
                <svg className="w-12 h-12 text-slate-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <span className="text-slate-400">Click to upload a file</span>
                <span className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX (max 5MB)</span>
                <input type="file" className="hidden" onChange={onStartAnalysis} accept=".pdf,.doc,.docx" />
            </label>
        </div>
    </div>
);

const AnalyzingState: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
        <p className="text-xl text-white mt-6 font-semibold">Analyzing job description and fetching best-fit profiles...</p>
        <p className="text-slate-400 mt-2">This might take a few moments. Please wait.</p>
    </div>
);

const ApprovedCandidateCard: React.FC<{ candidate: Candidate }> = ({ candidate }) => (
    <div className="relative bg-slate-800/50 backdrop-blur-sm ring-1 ring-green-500/30 rounded-2xl p-4 shadow-lg shadow-slate-900/50 flex flex-col justify-between h-full">
         <div>
            <div className="flex items-start justify-between mb-3">
                 <h3 className="text-base font-bold text-white truncate pr-2">{candidate.name}</h3>
                 <div className="flex-shrink-0 flex items-center gap-1 text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                    <CheckIcon className="w-3 h-3" />
                    Approved
                 </div>
             </div>
             <p className="text-xs text-cyan-400 mb-3 truncate">{candidate.designation}</p>
         </div>
         <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
            <span className="truncate pr-2">{candidate.source}</span>
            <ScoreBadge score={candidate.aiScore} />
         </div>
    </div>
);


const ResultsState: React.FC<{ 
    approvedCandidates: Candidate[], 
    reviewCandidates: Candidate[], 
    onMoveToNextLevel: (id: number) => void,
    onSkipRemaining: () => void 
}> = ({ approvedCandidates, reviewCandidates, onMoveToNextLevel, onSkipRemaining }) => (
    <div>
        <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Auto-Approved Candidates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
            {approvedCandidates.map(candidate => (
                <ApprovedCandidateCard key={candidate.id} candidate={candidate} />
            ))}
        </div>

        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Candidates Requiring Human Review</h2>
             {reviewCandidates.length > 0 && (
                 <button onClick={onSkipRemaining} className="text-sm font-semibold text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-md px-4 py-2 transition">
                     Skip All Remaining
                 </button>
            )}
        </div>

        {reviewCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviewCandidates.map(candidate => (
                    <CandidateReviewCard key={candidate.id} candidate={candidate} onMoveToNextLevel={onMoveToNextLevel} />
                ))}
            </div>
        ) : (
            <div className="text-center py-10 bg-slate-800/50 rounded-2xl border border-slate-700">
                <p className="text-slate-300 text-lg">All candidates have been reviewed.</p>
            </div>
        )}
    </div>
);

const CandidateReviewCard: React.FC<{ candidate: Candidate, onMoveToNextLevel: (id: number) => void }> = ({ candidate, onMoveToNextLevel }) => (
    <div className="relative bg-slate-800/50 backdrop-blur-sm ring-1 ring-white/10 rounded-2xl p-6 shadow-2xl shadow-slate-900/50 transition-all duration-300 hover:ring-white/20 hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="text-lg font-bold text-white">{candidate.name}</h3>
                <p className="text-sm text-cyan-400">{candidate.designation}</p>
            </div>
            <CircularProgress score={candidate.aiScore} className="w-16 h-16" />
        </div>
        <div className="space-y-2 text-sm text-slate-400">
             <p><strong>Source:</strong> {candidate.source}</p>
             <p><strong>Email:</strong> {candidate.email}</p>
             <p><strong>Phone:</strong> {candidate.phone}</p>
        </div>
        <div className="mt-6">
            <button onClick={() => onMoveToNextLevel(candidate.id)} className="w-full text-sm font-semibold text-white bg-green-600/80 hover:bg-green-600 rounded-md px-4 py-2 transition">Move to Next Level</button>
        </div>
    </div>
);

const SuccessModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
        <div className="relative p-8 w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl blur opacity-20 -z-10"></div>
            <div className="text-center">
                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 mb-4">
                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Analysis Complete!</h3>
                <p className="text-slate-300 mb-6">Top matches identified and moved to the next level successfully!</p>
                <button
                    onClick={onClose}
                    className="w-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 rounded-md px-4 py-2.5 transition"
                >
                    OK
                </button>
            </div>
        </div>
    </Modal>
);

export default ResumeAnalyzerPage;