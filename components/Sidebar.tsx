import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, GraduationCap } from 'lucide-react';
import { curriculumData } from '../services/curriculumData';
import { Lesson } from '../types';

interface SidebarProps {
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
  selectedLessonId: string | null;
  onLessonSelect: (lesson: Lesson, topicName: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedGrade,
  onGradeChange,
  selectedLessonId,
  onLessonSelect,
  isOpen,
  onToggle,
}) => {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const currentGradeData = curriculumData.find(g => g.grade === selectedGrade);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white">
      {/* Grade Tabs */}
      <div className="flex border-b border-slate-200 p-2 gap-2 shrink-0">
        {curriculumData.map(g => (
          <button
            key={g.grade}
            onClick={() => {
              onGradeChange(g.grade);
              setExpandedTopics(new Set());
            }}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-bold transition-all duration-300
              ${selectedGrade === g.grade
                ? `text-white shadow-lg`
                : 'text-slate-500 bg-slate-50 hover:bg-slate-100'
              }
            `}
            style={selectedGrade === g.grade ? { backgroundColor: g.color, boxShadow: `0 4px 14px ${g.color}40` } : {}}
          >
            <GraduationCap size={18} />
            <span>Lớp {g.grade}</span>
          </button>
        ))}
      </div>

      {/* Grade Title */}
      <div className="px-4 py-3 border-b border-slate-100 shrink-0">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {currentGradeData?.label} — Kết nối tri thức
        </h3>
      </div>

      {/* Topic List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {currentGradeData?.topics.map(topic => {
          const isExpanded = expandedTopics.has(topic.id);
          const hasActiveLesson = topic.lessons.some(l => l.id === selectedLessonId);

          return (
            <div key={topic.id} className="border-b border-slate-50">
              {/* Topic Header */}
              <button
                onClick={() => toggleTopic(topic.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-200 hover:bg-slate-50
                  ${hasActiveLesson ? 'bg-slate-50' : ''}
                `}
              >
                <span className="text-lg shrink-0">{topic.icon}</span>
                <span className="flex-1 text-sm font-bold text-slate-700 leading-tight">{topic.name}</span>
                <span className="text-xs font-medium text-slate-400 shrink-0">{topic.lessons.length} bài</span>
                {isExpanded
                  ? <ChevronDown size={16} className="text-slate-400 shrink-0" />
                  : <ChevronRight size={16} className="text-slate-400 shrink-0" />
                }
              </button>

              {/* Lesson List */}
              {isExpanded && (
                <div className="pb-2">
                  {topic.lessons.map(lesson => {
                    const isActive = lesson.id === selectedLessonId;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          onLessonSelect(lesson, topic.name);
                          // Auto close sidebar on mobile
                          if (window.innerWidth < 1024) onToggle();
                        }}
                        className={`
                          w-full text-left px-4 pl-12 py-2.5 text-sm transition-all duration-200 flex items-center gap-2
                          ${isActive
                            ? 'font-bold text-white rounded-r-none'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                          }
                        `}
                        style={isActive ? { backgroundColor: topic.color } : {}}
                      >
                        <BookOpen size={14} className={isActive ? 'text-white/80 shrink-0' : 'text-slate-300 shrink-0'} />
                        <span className="leading-tight">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[320px] shrink-0 border-r border-slate-200 h-[calc(100vh-64px)] sticky top-16 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onToggle} />
          <aside className="absolute left-0 top-0 bottom-0 w-[320px] max-w-[85vw] shadow-2xl z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
