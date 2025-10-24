import React, { useState, useEffect, useMemo } from 'react';
import { Candidate, KanbanStatus } from '../types';
import { ScoreBadge } from './CircularProgress';
import { UserIcon } from './icons/UserIcon';
import { MailIcon } from './icons/MailIcon';

type PanelState = 'screening' | 'summary' | 'followup';

const screeningContent: { [key: string]: { questions: string[]; answers: string[] } } = {
    'marketing': {
        questions: [
            "How would you approach developing a digital marketing strategy from scratch?",
            "What's your experience with budget allocation across different channels like PPC, SEO, and social media?",
            "Describe a successful campaign you managed and what made it successful.",
            "How do you measure the ROI of a content marketing initiative?",
            "What are the key metrics you track for an e-commerce website?",
            "How do you stay updated with the latest trends in digital marketing?"
        ],
        answers: [
            "I'd start with a deep dive into the target audience and competitive landscape, then define clear KPIs, choose the right channels, and create a content plan. Continuous A/B testing would be key.",
            "I use a data-driven approach, analyzing historical performance and CPA to allocate budget. I usually start with a 70/20/10 model for proven, emerging, and experimental channels.",
            "I managed a lead generation campaign using LinkedIn Ads that exceeded its target by 150%. The success was due to highly targeted audience segmentation and compelling ad creatives that addressed specific pain points.",
            "I track metrics like organic traffic growth, lead quality from content, conversion rates on gated content, and attribute revenue using marketing automation tools like HubSpot.",
            "Key metrics include Conversion Rate, Average Order Value (AOV), Customer Lifetime Value (CLV), Cart Abandonment Rate, and Traffic Source Analysis.",
            "I follow industry blogs like Moz and Search Engine Land, listen to podcasts, attend webinars, and I'm an active member of several marketing communities on Slack and LinkedIn."
        ]
    },
    'default': {
        questions: [
            "Can you tell me about a challenging project you've worked on?",
            "How do you handle tight deadlines and pressure?",
            "How do you collaborate with team members who have different working styles?",
            "What is your greatest professional achievement?",
            "How do you approach learning a new skill or technology?",
            "Where do you see yourself in the next five years?"
        ],
        answers: [
            "I once had to lead a project with shifting requirements. I implemented agile methodologies, held daily stand-ups to ensure alignment, and we delivered a successful product on time.",
            "I prioritize tasks using the MoSCoW method, focus on one thing at a time, and communicate proactively with stakeholders about any potential delays. Breaking down large tasks helps manage pressure.",
            "I focus on clear communication and finding common goals. I adapt my communication style and make an effort to understand their perspective to ensure we can work together effectively.",
            "I'm proud of mentoring a junior team member who was later promoted to a lead role. Seeing them grow and succeed based on my guidance was incredibly rewarding.",
            "I start with the official documentation, then build small personal projects to apply the knowledge. I also follow online tutorials and engage with communities to ask questions.",
            "I aim to take on more leadership responsibilities and deepen my expertise in this field. I'm eager to contribute to a company's long-term growth and success."
        ]
    }
};

const getScreeningContent = (designation: string) => {
    const lowerCaseDesignation = designation.toLowerCase();
    if (lowerCaseDesignation.includes('marketing') || lowerCaseDesignation.includes('seo') || lowerCaseDesignation.includes('ppc') || lowerCaseDesignation.includes('brand')) {
        return screeningContent['marketing'];
    }
    return screeningContent['default'];
};


const AIScreeningPanel: React.FC<{ candidate: Candidate; onUpdate: (candidate: Candidate) => void; onClose: () => void; }> = ({ candidate, onUpdate, onClose }) => {
    const [panelState, setPanelState] = useState<PanelState>('screening');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionAnswers, setSessionAnswers] = useState<string[]>([]);

    const { questions, answers: mockAnswers } = useMemo(() => getScreeningContent(candidate.designation), [candidate.designation]);
    
    useEffect(() => {
        setPanelState('screening');
        setCurrentQuestionIndex(0);
        setUserAnswer('');
        setSessionAnswers([]);
    }, [candidate]);
    
    useEffect(() => {
        let typingTimeout: number;
        if(panelState === 'screening' && currentQuestionIndex < questions.length) {
            setIsTyping(true);
            typingTimeout = setTimeout(() => {
                setIsTyping(false);
                setUserAnswer(mockAnswers[currentQuestionIndex])
            }, 1500)
        }
        return () => clearTimeout(typingTimeout);
    }, [currentQuestionIndex, panelState, questions, mockAnswers]);

    useEffect(() => {
        let progressTimeout: number;
        if (panelState === 'screening' && userAnswer === mockAnswers[currentQuestionIndex] && currentQuestionIndex < questions.length) {
             setSessionAnswers(prev => [...prev, userAnswer]);
            progressTimeout = setTimeout(() => {
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                    setUserAnswer('');
                } else {
                    setPanelState('summary');
                }
            }, 2000);
        }
        return () => clearTimeout(progressTimeout);
    }, [userAnswer, currentQuestionIndex, panelState, questions.length, mockAnswers]);

    const handleSchedule = () => onUpdate({ ...candidate, status: KanbanStatus.SCHEDULED });
    const handleSendFollowUp = () => onUpdate({ ...candidate, status: KanbanStatus.REVIEW });


    const renderContent = () => {
        switch (panelState) {
            case 'screening':
                return (
                    <div>
                        <p className="text-center text-sm text-slate-400 mb-1">Question {currentQuestionIndex + 1}/{questions.length}</p>
                        <div className="w-full bg-slate-700 rounded-full h-1.5 mb-6">
                            <div className="bg-cyan-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                        </div>
                        <p className="text-lg text-white font-semibold mb-4 min-h-[3em]">{questions[currentQuestionIndex]}</p>
                        <textarea
                            className="w-full h-28 bg-slate-700/50 text-white rounded-md p-3 border border-slate-600 focus:ring-2 focus:ring-cyan-500 outline-none transition resize-none"
                            placeholder={isTyping ? "Candidate is speaking..." : "Suggested answer will appear here..."}
                            value={userAnswer}
                            onChange={e => setUserAnswer(e.target.value)}
                            readOnly={isTyping}
                        />
                    </div>
                );
            case 'summary':
                return (
                    <div>
                        <h3 className="text-xl font-bold text-white text-center mb-4">AI Screening Summary</h3>
                        
                        <div className="bg-slate-700/30 p-4 rounded-lg max-h-48 overflow-y-auto space-y-4 mb-6 border border-slate-600 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50">
                            <h4 className="font-semibold text-white">Response Summary</h4>
                            {questions.map((q, index) => (
                                <div key={index} className="border-t border-slate-600/50 pt-2">
                                    <p className="text-sm font-medium text-cyan-400">Q: {q}</p>
                                    <p className="text-sm text-slate-300 mt-1">A: {sessionAnswers[index] || "No answer recorded."}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <SkillBar label="EQ" value={85} color="bg-green-500" />
                            <SkillBar label="Confidence" value={92} color="bg-cyan-500" />
                            <SkillBar label="Social Awareness" value={78} color="bg-purple-500" />
                            <SkillBar label="Problem Solving" value={95} color="bg-indigo-500" />
                        </div>
                        <div className="mt-8 flex gap-4">
                            <button onClick={handleSchedule} className="flex-1 font-semibold text-white bg-green-600/80 hover:bg-green-600 rounded-md px-4 py-2.5 transition">Schedule Interview</button>
                            <button onClick={() => setPanelState('followup')} className="flex-1 font-semibold text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-md px-4 py-2.5 transition">No Answer</button>
                        </div>
                    </div>
                );
            case 'followup':
                return (
                    <div>
                        <h3 className="text-xl font-bold text-white text-center mb-4">Follow-Up Message</h3>
                        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-sm">
                            <p className="text-slate-400 flex items-center gap-2"><MailIcon className="w-4 h-4 text-slate-500" /><span>To: {candidate.email}</span></p>
                            <p className="text-slate-400 mb-4">Subject: Follow-up on your application for {candidate.designation}</p>
                            <p className="text-slate-300">Hi {candidate.name.split(' ')[0]},</p>
                            <p className="text-slate-300 mt-2">Thank you for your interest. We tried reaching you for a preliminary AI screening but were unable to connect.</p>
                            <p className="text-slate-300 mt-2">Please let us know a suitable time for a brief call.</p>
                            <p className="text-slate-300 mt-4">Best regards,<br/>Timeless AI Hiring Team</p>
                        </div>
                         <div className="mt-6 flex gap-4">
                            <button onClick={handleSendFollowUp} className="flex-1 font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-md px-4 py-2.5 transition">Send Follow-Up</button>
                            <button onClick={() => setPanelState('summary')} className="flex-1 font-semibold text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-md px-4 py-2.5 transition">Back</button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="w-full max-w-lg bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 p-2 bg-slate-700 rounded-full">
                        <UserIcon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{candidate.name}</h2>
                        <p className="text-cyan-400">{candidate.designation}</p>
                    </div>
                </div>
                <ScoreBadge score={candidate.aiScore} />
            </div>
            {renderContent()}
        </div>
    );
};

const SkillBar: React.FC<{label: string, value: number, color: string}> = ({label, value, color}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-300">{label}</span>
            <span className="text-sm font-medium text-slate-400">{value}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
            <div className={`${color} h-2 rounded-full`} style={{width: `${value}%`}}></div>
        </div>
    </div>
);


export default AIScreeningPanel;