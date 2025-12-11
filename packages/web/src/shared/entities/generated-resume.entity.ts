export interface GeneratedResume {
  id: string;
  userId: string;
  resumeId: string;
  sessionId: string | null;
  title: string;
  jobDescription: string | null;
  fileUrl: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
