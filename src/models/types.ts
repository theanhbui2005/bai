export interface User {
  id: string;
  username: string;
  password: string;
  role: 'student' | 'admin';
  email: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
}

export interface Major {
  id: string;
  name: string;
  code: string;
  schoolId: string;
  subjectGroups: SubjectGroup[];
}

export interface SubjectGroup {
  id: string;
  name: string;
  subjects: string[];
}

export interface Application {
  id: string;
  studentId: string;
  schoolId: string;
  majorId: string;
  subjectGroupId: string;
  status: 'pending' | 'approved' | 'rejected';
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    idNumber: string;
    address: string;
  };
  scores: {
    [subject: string]: number;
  };
  documents: {
    type: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
