export enum CandidateSource {
    LINKEDIN = 'LinkedIn',
    NAUKRI_GULF = 'Naukri Gulf',
    TIMELESS_DB = 'Timeless DB',
}

export enum KanbanStatus {
    SOURCED = 'Sourced',
    NEW = 'New Applications',
    REVIEW = 'Under Review',
    SCHEDULED = 'Scheduled',
}

export interface Candidate {
    id: number;
    name: string;
    designation: string;
    email: string;
    phone: string;
    source: CandidateSource;
    aiScore: number; // 1-10
    status: KanbanStatus;
}

export type Page = 'signin' | 'landing' | 'analyzer' | 'queue';