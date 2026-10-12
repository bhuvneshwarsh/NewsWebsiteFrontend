import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Navigate } from 'react-router-dom';
import { AlertCircle, Mail, MessageSquare, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { contactMessagesApi } from '../../services/api';
import type { ContactMessage } from '../../services/api';
import { parseApiTimestamp } from '../../utils/date';

export default function ContactMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await contactMessagesApi.list();
      setMessages(response.data.data ?? []);
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
        err.response?.data?.Message ??
        'Unable to load contact messages.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'SuperAdmin') void loadMessages();
  }, [loadMessages, user?.role]);

  if (user?.role !== 'SuperAdmin') return <Navigate to="/admin" replace />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Contact Messages</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Messages submitted through the website contact form
          </p>
        </div>
        <button
          onClick={() => void loadMessages()}
          disabled={loading}
          className="flex items-center gap-2 text-sm border border-gray-200
            text-gray-600 hover:border-brand-400 hover:text-brand-600
            px-3 py-2 rounded-xl transition disabled:opacity-50">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-4 flex items-start gap-2 p-3 bg-red-50
          border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center
          text-gray-400 text-sm">
          Loading contact messages…
        </div>
      ) : messages.length === 0 && !error ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
          p-14 text-center text-gray-400">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No contact messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(message => (
            <article key={message.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start
                sm:justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 break-words">
                    {message.subject}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {message.name}
                  </p>
                  <a href={`mailto:${message.email}`}
                    className="inline-flex items-center gap-1.5 mt-1 text-sm
                      text-brand-600 hover:underline break-all">
                    <Mail size={13} className="shrink-0" />
                    {message.email}
                  </a>
                </div>
                <time className="shrink-0 text-xs text-gray-400">
                  {format(parseApiTimestamp(message.submittedAt), 'dd MMM yyyy, h:mm a')}
                </time>
              </div>
              <p className="border-t border-gray-100 pt-3 text-sm text-gray-700
                leading-relaxed whitespace-pre-wrap break-words">
                {message.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
