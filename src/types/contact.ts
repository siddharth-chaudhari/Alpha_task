export type Stage = 'Lead' | 'Prospect' | 'Qualified' | 'Customer';

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  owner: string;
  labels: string[];
  stage: Stage;
  notes: string;
}

export type ViewMode = 'table' | 'board';
