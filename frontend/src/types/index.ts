export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  coverImage?: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'pothole' | 'garbage' | 'streetlight' | 'water' | 'other';
  status: 'pending' | 'verified' | 'in_progress' | 'resolved' | 'rejected';
  reportedBy: User;
  location: {
    lat: number;
    lng: number;
  };
  address?: string;
  priority: number;
  media: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  _id: string;
  campaignName: string;
  description: string;
  campaignDate: string;
  campaignStatus: 'upcoming' | 'ongoing' | 'completed';
  participants: User[];
  pointsAddedAfterJoining: number;
  createdAt: string;
  updatedAt: string;
  organizer: User;
}

export interface Assignment {
  _id: string;
  issueId: Issue;
  assignedTo: User;
  assignedBy: User;
  status: 'assigned' | 'in_progress' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  _id: string;
  issueId: string;
  userId: User;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalIssues: number;
  resolvedIssues: number;
  pendingIssues: number;
  activeCampaigns: number;
  userPoints: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  fullName: string;
  password: string;
  avatar?: File;
  coverImage?: File;
}
export interface Issue {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'pothole' | 'garbage' | 'streetlight' | 'water' | 'other';
  status: 'pending' | 'verified' | 'in_progress' | 'resolved' | 'rejected';
  reportedBy: User;
  location: {
    lat: number;
    lng: number;
  };
  address?: string;
  priority: number;
  media: string[];
  createdAt: string;
  updatedAt: string;
  aiVerified?: boolean; // AI verification status
  aiTags?: string[];    // AI-generated tags
}

export interface AIVerification {
  _id: string;
  issueId: string;
  verified: boolean;
  confidenceScore: number;
  duplicateOf?: string; // Optional field for duplicate issue ID
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'pothole' | 'garbage' | 'streetlight' | 'water' | 'other';
  status: 'pending' | 'verified' | 'in_progress' | 'resolved' | 'rejected';
  reportedBy: User;
  location: {
    lat: number;
    lng: number;
  };
  address?: string;
  priority: number;
  media: string[];
  createdAt: string;
  updatedAt: string;
  aiVerification?: AIVerification; // Replaced previous ai fields with this object
}
