export * from './ads';
export * from './editor';
export * from './employee';

export interface AuthUser {
  token: string;
  fullName: string;
  email: string;
  role: string;
  expiry: string;
  employeeId?: string;
  designation?: string;
  imageUrl?: string;
  mustChangePassword?: boolean;
}

export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  categoryName: string;
  categoryId: number;
  authorName: string;
  isPublished: boolean;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  approvalStatus: string;
  approvalNote: string | null;
}

export interface ArticleDetail {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl: string | null;
  categoryId: number;
  categoryName: string;
  authorId: number;
  authorName: string;
  isPublished: boolean;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  approvalStatus: string;
  approvalNote: string | null;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface EPaper {
  id: number;
  date: string;
  pdfUrl: string;
}

export interface AdminStats {
  totalUsers: number;
  totalArticles: number;
  totalViews: number;
  totalEPapers: number;
  recentArticles: Array<{
    id: number;
    title: string;
    category: string;
    author: string;
    views: number;
    isPublished: boolean;
  }>;
}
