export type Role = 'SuperAdmin' | 'Admin' | 'Reporter' | 'User';

export interface AuthUser {
  token:    string;
  fullName: string;
  email:    string;
  role:     Role;
  expiry:   string;
}

export interface ArticleListItem {
  id:           number;
  title:        string;
  slug:         string;
  thumbnailUrl: string | null;
  categoryName: string;
  authorName:   string;
  isPublished:  boolean;
  views:        number;
  publishedAt:  string | null;
  createdAt:    string;
}

export interface ArticleDetail extends ArticleListItem {
  content:    string;
  categoryId: number;
  authorId:   number;
}

export interface PaginatedResult<T> {
  items:       T[];
  page:        number;
  pageSize:    number;
  totalCount:  number;
  totalPages:  number;
  hasNext:     boolean;
  hasPrevious: boolean;
}

export interface Category {
  id:   number;
  name: string;
  slug: string;
}

export interface EPaper {
  id:           number;
  date:         string;
  pdfUrl:       string;
  thumbnailUrl: string | null;
  uploadedAt:   string;
}

export interface AdminStats {
  totalUsers:        number;
  totalArticles:     number;
  publishedArticles: number;
  draftArticles:     number;
  totalViews:        number;
  totalEPapers:      number;
  recentArticles:    ArticleListItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
}
