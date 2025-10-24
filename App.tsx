import React, { useState, useCallback } from 'react';
import SignInPage from './pages/SignInPage';
import LandingPage from './pages/LandingPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import AIQueuePage from './pages/AIQueuePage';
import { Page, Candidate } from './types';
import { CANDIDATES } from './constants';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('signin');
    const [candidates, setCandidates] = useState<Candidate[]>(CANDIDATES);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const handleLoginSuccess = useCallback(() => {
        setIsAuthenticated(true);
        setCurrentPage('landing');
    }, []);
    
    const navigateTo = useCallback((page: Page) => {
        if (isAuthenticated) {
            setCurrentPage(page);
        }
    }, [isAuthenticated]);

    const renderPage = () => {
        if (!isAuthenticated) {
            return <SignInPage onLoginSuccess={handleLoginSuccess} />;
        }
        
        switch (currentPage) {
            case 'landing':
                return <LandingPage onNavigate={navigateTo} />;
            case 'analyzer':
                return <ResumeAnalyzerPage onNavigate={navigateTo} candidates={candidates} setCandidates={setCandidates} />;
            case 'queue':
                return <AIQueuePage candidates={candidates} setCandidates={setCandidates} onNavigate={navigateTo} />;
            default:
                return <SignInPage onLoginSuccess={handleLoginSuccess} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 font-sans">
            {renderPage()}
        </div>
    );
};

export default App;