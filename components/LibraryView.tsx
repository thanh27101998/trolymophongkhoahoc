import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Trash2, ExternalLink, Clock, Sparkles } from 'lucide-react';

interface SavedSimulation {
  id: string;
  grade: string;
  topicName: string;
  lessonTitle: string;
  html: string;
  questions: string;
  guide: string;
  createdAt: string;
}

const STORAGE_KEY = 'kh45_saved_simulations';

const LibraryView: React.FC = () => {
  const [saved, setSaved] = useState<SavedSimulation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGrade, setActiveGrade] = useState<string>('Tất cả');
  const [previewSim, setPreviewSim] = useState<SavedSimulation | null>(null);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try { setSaved(JSON.parse(data)); } catch { /* ignore */ }
    }
  }, []);

  const filtered = saved.filter(sim => {
    const matchGrade = activeGrade === 'Tất cả' || sim.grade === activeGrade;
    const matchSearch = sim.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sim.topicName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGrade && matchSearch;
  });

  const handleDelete = (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa mô phỏng này?')) return;
    const updated = saved.filter(s => s.id !== id);
    setSaved(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const openSimulation = (sim: SavedSimulation) => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(sim.html);
      win.document.close();
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="text-[#0D9488]" />
              Thư viện mô phỏng
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {saved.length > 0
                ? `${saved.length} mô phỏng đã tạo bằng AI`
                : 'Chưa có mô phỏng nào. Hãy chọn bài học để bắt đầu tạo!'}
            </p>
          </div>

          {saved.length > 0 && (
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo tên bài hoặc chủ đề..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 bg-slate-50 focus:border-[#0D9488] focus:ring-[#0D9488]/20 transition-all text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
          )}
        </div>

        {saved.length > 0 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['Tất cả', 'Lớp 4', 'Lớp 5'].map(grade => (
              <button
                key={grade}
                onClick={() => setActiveGrade(grade)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all
                  ${activeGrade === grade
                    ? 'bg-[#0D9488] text-white shadow-md shadow-teal-600/20'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-100'}`}
              >
                {grade}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {saved.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-teal-200">
          <div className="bg-teal-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles size={36} className="text-teal-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Thư viện trống</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Chọn một bài học từ trang "Bài học" và tạo mô phỏng bằng AI.
            Mô phỏng sẽ được lưu tự động vào thư viện này.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-teal-200">
          <p className="text-slate-500 font-medium">Không tìm thấy mô phỏng phù hợp.</p>
          <button
            onClick={() => { setActiveGrade('Tất cả'); setSearchTerm(''); }}
            className="mt-4 text-[#0D9488] font-bold hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(sim => (
            <div key={sim.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">{sim.grade}</span>
                  <h3 className="text-sm font-bold text-slate-800 mt-2 leading-tight">{sim.lessonTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1">{sim.topicName}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(sim.createdAt).toLocaleDateString('vi-VN')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openSimulation(sim)}
                    className="flex items-center gap-1 text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <ExternalLink size={14} />
                    Mở
                  </button>
                  <button
                    onClick={() => handleDelete(sim.id)}
                    className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryView;