import React from 'react';
import { Microscope, Settings, Menu, BookOpen, Library } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface HeaderProps {
  onOpenGuide: () => void;
  currentView: 'main' | 'library';
  onViewChange: (view: 'main' | 'library') => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenGuide, currentView, onViewChange, onToggleSidebar }) => {
  const { apiKey, setIsSettingsOpen } = useSettings();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-teal-100 px-4 md:px-6 py-3 shadow-sm h-16">
      <div className="h-full flex items-center justify-between">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          {currentView === 'main' && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu size={22} />
            </button>
          )}

          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onViewChange('main')}
          >
            <div className="bg-[#0D9488] text-white p-2 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20 group-hover:bg-[#0F766E] transition-colors">
              <Microscope size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-none tracking-tight text-[#0D9488]">MÔ PHỎNG KHOA HỌC 4-5</h1>
              <p className="text-[10px] text-teal-700/70 font-medium uppercase tracking-wider hidden sm:block">Sách Kết nối tri thức</p>
            </div>
          </div>
        </div>

        {/* Center: Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onViewChange('main')}
            className={`flex items-center gap-1.5 text-sm font-bold pb-1 transition-all ${currentView === 'main' ? 'text-[#0D9488] border-b-2 border-[#0D9488]' : 'text-teal-700/60 hover:text-[#0D9488]'}`}
          >
            <BookOpen size={16} />
            Bài học
          </button>
          <button
            onClick={() => onViewChange('library')}
            className={`flex items-center gap-1.5 text-sm font-bold pb-1 transition-all ${currentView === 'library' ? 'text-[#0D9488] border-b-2 border-[#0D9488]' : 'text-teal-700/60 hover:text-[#0D9488]'}`}
          >
            <Library size={16} />
            Thư viện
          </button>
          <button
            onClick={onOpenGuide}
            className="text-teal-700/60 text-sm font-bold hover:text-[#0D9488] transition-colors"
          >
            Hướng dẫn
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${!apiKey ? 'bg-red-50 text-red-600 border border-red-200' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Settings size={18} />
            {!apiKey && <span className="text-xs font-bold animate-pulse hidden sm:inline">Cần API Key</span>}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
