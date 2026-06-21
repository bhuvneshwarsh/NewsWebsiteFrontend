import { useEffect, useRef, useState } from 'react';
import { articlesApi } from '../services/api';
import type { ArticleListItem } from '../types';

export function useArticles(options: {
  category?: string;
  search?:   string;
  pageSize?: number;
}) {
  const { category, search, pageSize = 10 } = options;
  const [articles,  setArticles]  = useState<ArticleListItem[]>([]);
  const [page,      setPage]      = useState(1);
  const [hasMore,   setHasMore]   = useState(true);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const isFirstLoad = useRef(true);

  const load = async (pageNum: number, reset = false) => {
    setLoading(true); setError('');
    try {
      const res = await articlesApi.list({
        page:     pageNum,
        size:     pageSize,
        category: category || undefined,
      });
      const data = res.data.data;
      setArticles(prev => reset ? data.items : [...prev, ...data.items]);
      setHasMore(data.hasNext);
      setPage(pageNum);
    } catch {
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset when filters change
  useEffect(() => {
    if (isFirstLoad.current) { isFirstLoad.current = false; }
    setArticles([]);
    setPage(1);
    setHasMore(true);
    load(1, true);
  }, [category, search]);

  const loadMore = () => { if (!loading && hasMore) load(page + 1); };

  return { articles, loading, error, hasMore, loadMore };
}