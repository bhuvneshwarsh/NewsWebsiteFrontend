// ── Add/update these interfaces in your existing src/types/index.ts ────────────

export interface ArticleListItem {
  id:             number;
  title:          string;
  slug:           string;
  thumbnailUrl:   string | null;
  categoryName:   string;
  categoryId:     number;
  authorName:     string;
  isPublished:    boolean;
  views:          number;
  publishedAt:    string | null;
  createdAt:      string;
  // ── NEW: approval fields ──────────────────────────────────────────────────
  approvalStatus: string;   // 'NotRequired' | 'Pending' | 'Approved' | 'Rejected'
  approvalNote:   string | null;  // rejection reason shown to employee
}

export interface ArticleDetail {
  id:             number;
  title:          string;
  slug:           string;
  content:        string;
  thumbnailUrl:   string | null;
  categoryId:     number;
  categoryName:   string;
  authorId:       number;
  authorName:     string;
  isPublished:    boolean;
  views:          number;
  publishedAt:    string | null;
  createdAt:      string;
  // ── NEW: approval fields ──────────────────────────────────────────────────
  approvalStatus: string;
  approvalNote:   string | null;
}

export interface PaginatedResult<T> {
  items:      T[];
  page:       number;
  pageSize:   number;
  totalCount: number;
  totalPages: number;
  hasNext:    boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
}

export interface Category {
  id:   number;
  name: string;
  slug: string;
}
