import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-serif text-8xl font-bold text-brand-100 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h2>
      <p className="text-gray-500 text-sm mb-6 max-w-sm">
        The article or page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/"
        className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
        Back to home
      </Link>
    </div>
  );
}