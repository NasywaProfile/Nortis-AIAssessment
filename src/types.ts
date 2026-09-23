export interface AssessmentSubmission {
  id: string;
  timestamp: string;
  assessmentType?: 'organization' | 'individual';
  // Form data
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  aiGoal?: string;
  aiUseCase?: string;
  aiTools?: string;
  aiCurrentUse?: string;
  aiFrequentUse?: string;
  aiLearningNeed?: string;
  aiMasteryTarget?: string;
  timeline?: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  
  // Individual form specific
  experienceYears?: string;
  aiUsageFrequency?: string;
  aiToolsUsed?: string;

  // Scores
  overallScore: number;
  scores: {
    strategi?: number;
    proses?: number;
    sdm?: number;
    data?: number;
    tataKelola?: number;
    // Individual dimensions
    aiLiteracy?: number;
    taskFraming?: number;
    workflow?: number;
    evaluation?: number;
    responsibleAi?: number;
    collaboration?: number;
    [key: string]: number | undefined;
  };
  readinessLevel: string;
  readinessDescription: string;
  answers?: Record<string, number>;
}

export interface FormData {
  assessmentType?: 'organization' | 'individual';
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  aiGoal?: string;
  aiUseCase?: string;
  aiTools?: string;
  aiCurrentUse?: string;
  aiFrequentUse?: string;
  aiLearningNeed?: string;
  aiMasteryTarget?: string;
  timeline?: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  
  // Individual specific
  experienceYears?: string;
  aiUsageFrequency?: string;
  aiToolsUsed?: string;
}
