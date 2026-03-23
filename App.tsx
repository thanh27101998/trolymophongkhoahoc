import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import SimulationForm from './components/SimulationForm';
import LibraryView from './components/LibraryView';
import GuideModal from './components/GuideModal';
import SettingsModal from './components/SettingsModal';
import { Lesson, SimulationParams, AIResult, AppStatus } from './types';
import { generateSimulationContent } from './services/geminiService';
import { useSettings } from './contexts/SettingsContext';
import { Sparkles, BookOpen, ArrowRight, Menu } from 'lucide-react';

type ViewState = 'main' | 'library';

interface SelectedLesson {
  lesson: Lesson;
  topicName: string;
}

function App() {
  const { apiKey, selectedModel, setIsSettingsOpen } = useSettings();
  const [currentView, setCurrentView] = useState<ViewState>('main');
  const [selectedGrade, setSelectedGrade] = useState('4');
  const [selectedLesson, setSelectedLesson] = useState<SelectedLesson | null>(null);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLessonSelect = (lesson: Lesson, topicName: string) => {
    setSelectedLesson({ lesson, topicName });
    setStatus('idle');
    setAiResult(null);
  };

  const STORAGE_KEY = 'kh45_saved_simulations';

  const saveToLibrary = (params: SimulationParams, result: AIResult) => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      // Tránh trùng lặp: nếu đã có bài cùng tên + lớp + chủ đề thì ghi đè
      const duplicateIndex = existing.findIndex(
        (s: any) => s.lessonTitle === params.lessonTitle && s.grade === params.grade && s.topicName === params.topicName
      );
      const newSim = {
        id: duplicateIndex >= 0 ? existing[duplicateIndex].id : Date.now().toString(),
        grade: params.grade,
        topicName: params.topicName,
        lessonTitle: params.lessonTitle,
        html: result.html,
        questions: result.questions,
        guide: result.guide,
        createdAt: new Date().toISOString(),
      };
      if (duplicateIndex >= 0) {
        existing[duplicateIndex] = newSim;
      } else {
        existing.unshift(newSim);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      console.log('[Library] Saved simulation:', params.lessonTitle);
    } catch (e) {
      console.warn('[Library] Failed to save:', e);
    }
  };

  const handleGenerate = async (params: SimulationParams) => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setStatus('generating');
    setAiResult(null);

    try {
      const result = await generateSimulationContent(params, apiKey, selectedModel);
      setAiResult(result);
      setStatus('generated');
      // Tự động lưu vào thư viện
      if (selectedLesson) {
        saveToLibrary(params, result);
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setAiResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F0F9F9]">
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        currentView={currentView}
        onViewChange={setCurrentView}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {currentView === 'library' ? (
        <main className="flex-grow max-w-[1600px] mx-auto w-full px-4 md:px-8 py-8">
          <LibraryView />
        </main>
      ) : (
        <div className="flex-grow flex">
          {/* Sidebar */}
          <Sidebar
            selectedGrade={selectedGrade}
            onGradeChange={setSelectedGrade}
            selectedLessonId={selectedLesson?.lesson.id || null}
            onLessonSelect={handleLessonSelect}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(false)}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8">
              {!selectedLesson ? (
                /* Welcome / Empty State */
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                  <div className="relative mb-8">
                    <div className="size-28 rounded-3xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center shadow-lg shadow-teal-100">
                      <BookOpen size={48} className="text-teal-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 size-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg animate-bounce">
                      <Sparkles size={20} className="text-white" />
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                    Mô phỏng Khoa học 4-5
                  </h2>
                  <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                    Chọn một bài học từ thanh bên trái để bắt đầu tạo mô phỏng tương tác bằng AI.
                    Hỗ trợ toàn bộ chương trình Khoa học lớp 4 và lớp 5 — Sách Kết nối tri thức.
                  </p>

                  {/* Mobile hint */}
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden flex items-center gap-3 bg-white border-2 border-teal-200 text-teal-700 font-bold py-4 px-8 rounded-2xl shadow-md hover:shadow-lg hover:border-teal-300 transition-all"
                  >
                    <Menu size={20} />
                    <span>Mở danh sách bài</span>
                    <ArrowRight size={18} />
                  </button>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-lg">
                    {[
                      { label: 'Lớp học', value: '2', icon: '🎓' },
                      { label: 'Chủ đề', value: '12', icon: '📚' },
                      { label: 'Bài học', value: '61', icon: '📖' },
                      { label: 'AI Model', value: 'Gemini', icon: '🤖' },
                    ].map(stat => (
                      <div key={stat.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                        <span className="text-2xl">{stat.icon}</span>
                        <p className="text-xl font-bold text-slate-800 mt-1">{stat.value}</p>
                        <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Simulation Form */
                <SimulationForm
                  grade={selectedGrade}
                  topicName={selectedLesson.topicName}
                  lessonTitle={selectedLesson.lesson.title}
                  onGenerate={handleGenerate}
                  isLoading={status === 'generating'}
                  aiResult={aiResult}
                  status={status}
                  onReset={handleReset}
                />
              )}
            </div>
          </main>
        </div>
      )}

      {/* Loading Overlay */}
      {status === 'generating' && (
        <div className="fixed inset-0 z-[100] bg-teal-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-teal-50 flex flex-col items-center gap-6 max-w-sm text-center">
            <div className="relative">
              <div className="size-24 border-4 border-teal-50 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin"></div>
              <span className="absolute inset-0 flex items-center justify-center text-[#0D9488]">
                <Sparkles size={32} />
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Đang khởi tạo mô phỏng...</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                AI đang viết mã HTML, Canvas logic và thiết kế giao diện cho bài <strong>"{selectedLesson?.lesson.title}"</strong>
              </p>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#0D9488] h-full w-[65%] rounded-full shadow-[0_0_15px_rgba(13,148,136,0.4)] animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <SettingsModal />

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default App;