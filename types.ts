// Curriculum types
export interface Lesson {
  id: string;
  title: string;
  page: number;
}

export interface Topic {
  id: string;
  name: string;
  color: string;
  icon: string;
  lessons: Lesson[];
}

export interface GradeData {
  grade: string;
  label: string;
  color: string;
  topics: Topic[];
}

// File upload
export interface UploadedFile {
  name: string;
  type: 'image' | 'pdf' | 'text';
  content: string;
  mimeType: string;
}

// Search / Generation params
export interface SimulationParams {
  grade: string;
  topicName: string;
  lessonTitle: string;
  parameters?: string;
  expectedResult?: string;
  devices: string[];
  uploadedFiles?: UploadedFile[];
}

// AI result
export interface AIResult {
  html: string;
  questions: string;
  guide: string;
}

export type AppStatus = 'idle' | 'generating' | 'generated' | 'error';

export const DEVICE_OPTIONS = [
  { id: 'projector', label: 'Máy chiếu + Laptop' },
  { id: 'mobile', label: 'Chỉ có điện thoại' },
  { id: 'offline', label: 'Không có internet' },
  { id: 'online', label: 'Có internet ổn định' }
];