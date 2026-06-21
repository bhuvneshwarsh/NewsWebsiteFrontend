import { Link } from 'react-router-dom';
import { Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ArticleListItem } from '../../types';

interface Props {
  article:  ArticleListItem;
  featured?: boolean;   // bigger card for hero slot
}

export default function ArticleCard({ article, featured = false }: Props) {
  const timeAgo = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : '';

  if (featured) {
    return (
      <Link to={`/news/${article.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-gray-200 aspect-[16/9]">
          {article.thumbnailUrl ? (
            <img
              src={article.thumbnailUrl} alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="inline-block bg-brand-600 text-white text-xs font-semibold px-2 py-0.5 rounded mb-2">
              {article.categoryName}
            </span>
            <h2 className="font-serif text-xl md:text-2xl font-bold text-white leading-snug
              group-hover:text-brand-200 transition line-clamp-3">
              {article.title}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-white/60 text-xs">
              <span className="flex items-center gap-1"><Clock size={11} /> {timeAgo}</span>
              <span className="flex items-center gap-1"><Eye size={11} /> {article.views}</span>
              <span>{article.authorName}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/news/${article.slug}`} className="group flex gap-3 bg-white rounded-xl shadow-sm hover:shadow-md transition p-3">
      <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
        {article.thumbnailUrl ? (
          <img src={article.thumbnailUrl} alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold text-brand-600">{article.categoryName}</span>
        <h3 className="font-semibold text-gray-800 text-sm leading-snug mt-0.5 line-clamp-2
          group-hover:text-brand-600 transition">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5 text-gray-400 text-xs">
          <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo}</span>
          <span className="flex items-center gap-1"><Eye size={10} /> {article.views}</span>
        </div>
      </div>
    </Link>
  );
}