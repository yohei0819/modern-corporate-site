export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  created_at: string;
  updated_at: string;
}

export interface JobPosting {
  id: number;
  title: string;
  slug: string;
  employment_type: 'full-time' | 'contract' | 'part-time';
  location: string;
  salary_text: string;
  summary: string;
  description: string;
  requirements: string;
  status: 'draft' | 'published';
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: number;
  name: string;
  slug: string;
  department: string;
  position: string;
  catch_copy: string;
  message: string;
  profile_image: string | null;
  profile_image_url: string | null;
  status: 'draft' | 'published';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  category: 'info' | 'press' | 'event';
  summary: string;
  body: string;
  thumbnail: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  job_posting_id: number;
  job_posting?: JobPosting;
  name: string;
  email: string;
  phone: string;
  resume_path: string | null;
  message: string | null;
  status: 'new' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected';
  admin_memo: string | null;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  category: string;
  body: string;
  status: 'new' | 'in_progress' | 'closed';
  admin_memo: string | null;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: number;
  filename: string;
  path: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ActivityLog {
  id: number;
  user_id: number | null;
  user?: { id: number; name: string } | null;
  action: string;
  target_type: string;
  target_id: number | null;
  description: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}
