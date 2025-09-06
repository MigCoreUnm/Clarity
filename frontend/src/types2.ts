export interface Policy {
  id: string;
  title: string;
  description: string;
  hiddenNotes?: string;
}

export interface PolicyGroup {
  id: string;
  title: string;
  policies: Policy[];
}