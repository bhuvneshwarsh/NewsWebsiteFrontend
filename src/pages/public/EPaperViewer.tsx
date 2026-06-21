import { useEffect, useState } from 'react';
import { epaperApi } from '../../services/api';
import type { EPaper } from '../../types';
import { FileText, Calendar, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function EPaperViewer() {
  const [papers,   setPapers]   = useState<EPaper[]>([]);
  const [selected, setSelected] = useState<EPaper | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    epaperApi.list()
      .then(r => {
        const list = r.data.data;
        setPapers(list);
        if (list.length) setSelected(list[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentIndex = papers.findIndex(p => p.id === selected?.id);
  const hasPrev      = currentIndex < papers.length - 1;
  const hasNext      = currentIndex > 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">E-Paper</h1>
          <p className="text-sm text-gray-500 mt-0.5">Read today's edition and browse the archive</p>
        </div>
        {selected && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => hasPrev && setSelected(papers[currentIndex + 1])}
              disabled={!hasPrev}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-brand-400
                hover:text-brand-600 disabled:opacity-30 disabled:cursor-not-allowed transition">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-600 px-2">
              {selected ? format(new Date(selected.date), 'dd MMM yyyy') : ''}
            </span>
            <button
              onClick={() => hasNext && setSelected(papers[currentIndex - 1])}
              disabled={!hasNext}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-brand-400
                hover:text-brand-600 disabled:opacity-30 disabled:cursor-not-allowed transition">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="aspect-[3/4] max-w-3xl mx-auto bg-gray-200 rounded-2xl animate-pulse" />
      ) : !selected ? (
        <div className="text-center py-20 text-gray-400">
          <FileText size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No e-papers published yet.</p>
          <p className="text-sm mt-1">Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* PDF viewer — main */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FileText size={15} className="text-brand-500" />
                  <span className="font-medium">
                    {format(new Date(selected.date), 'EEEE, dd MMMM yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a href={selected.pdfUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-600 transition px-2 py-1.5 rounded-lg hover:bg-gray-100">
                    <ExternalLink size={13} /> Open
                  </a>
                  <a href={selected.pdfUrl} download
                    className="flex items-center gap-1.5 text-xs bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg font-medium transition">
                    <Download size={13} /> Download
                  </a>
                </div>
              </div>

              {/* PDF iframe embed */}
              <div className="relative bg-gray-900" style={{ height: '75vh' }}>
                <iframe
                  src={`${selected.pdfUrl}#toolbar=0&navpanes=0`}
                  title={`E-Paper ${selected.date}`}
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>

          {/* Archive sidebar */}
          <aside>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar size={14} /> Archive
                </h3>
              </div>
              <div className="divide-y divide-gray-50 max-h-[70vh] overflow-y-auto">
                {papers.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={`w-full text-left px-4 py-3 text-sm transition
                      ${p.id === selected?.id
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <div className="font-medium">
                      {format(new Date(p.date), 'dd MMM yyyy')}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {format(new Date(p.date), 'EEEE')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}