export interface LeadContext {
  useCase: string;
  companyType: string;
  teamSize: string;
  urgency: string;
  integrations: string;
  budget: string;
  otherRequirements?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  extractedFields?: Partial<LeadContext>;
}

export interface Specialist {
  id: string;
  name: string;
  role: 'solutions-engineer' | 'compliance-officer' | 'account-executive' | 'product-manager';
  roleLabel: string;
  avatar: string;
  bio: string;
  relevanceScore: number;
  matchCriteria: string[];
}

export interface ScopedShareLink {
  id: string;
  role: string;
  roleLabel: string;
  url: string;
  visibleFields: string[];
  hiddenFields: string[];
}
