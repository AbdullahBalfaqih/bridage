

export type Project = {
  id: string;
  name: string;
  inventor: string; // Denormalized submitter name
  submitterId: string;
  
  briefDescription?: string;
  problemDescription: string;
  proposedSolution: string;
  
  requiredCost: number;
  expectedProfits: number;
  
  duration: string;
  category: string;
  
  image: string;
  imageHint: string;
  
  currentFunding: number;
  investors: number;
  
  createdAt: string; // Firestore Timestamp
  status: string;
  type: 'standard' | 'venom';
  publishDate: string; // Keep for sorting, can be same as createdAt
};

export type Investment = {
    id?: string;
    investorId: string;
    projectId: string;
    amount: number;
    investmentDate: string; // Firestore Timestamp
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Refunded';
};

export type UserProfile = {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    virtualBalance: number;
    role: 'inventor' | 'investor' | 'visitor';
    city: string;
}

export type Notification = {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string; // Firestore Timestamp
  isRead: boolean;
  type: 'investment_accepted' | 'project_update' | 'welcome' | 'system';
  relatedId?: string;
};

export type Favorite = {
    id?: string;
    createdAt: string; // Firestore Timestamp
};
