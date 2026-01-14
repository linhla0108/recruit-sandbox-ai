
export interface JobDescription {
  title: string;
  companyName: string;
  location: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  callToAction: string;
}

export interface InterviewQuestion {
  question: string;
  targetSkill: string;
  rationale: string;
  expectedIndicators: string[];
}

export interface RecruitmentData {
  jobDescription: JobDescription;
  interviewGuide: InterviewQuestion[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
