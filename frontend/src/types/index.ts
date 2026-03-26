export interface JobPosting {
  id: number;
  title: string;
  slug: string;
  employment_type: string;
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
  category: 'info' | 'press' | 'event' | 'blog';
  excerpt: string;
  body: string;
  thumbnail: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApplicationFormData {
  job_posting_id: number;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  message: string;
  resume: File | null;
  portfolio_url: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}
