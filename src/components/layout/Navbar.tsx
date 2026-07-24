import React, { useState } from 'react';
import { useChartStore } from '../../store/useChartStore';
import { AdminAuthModal } from './AdminAuthModal';
import type { StepType } from '../../types/chart';
import { 
  BarChart3, 
  Database, 
  Sliders, 
  Share2, 
  Edit3, 
  ShieldCheck, 
  LogOut, 
  UserCheck 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { projectTitle, setProjectTitle, step, setStep, auth, logout } = useChartStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const steps: { id: StepType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 1, label: '1. 데이터 입력', icon: <Database className="w-4 h-4" />, desc: 'CSV & 데이터 편집' },
    { id: 2, label: '2. 차트 선택/설정', icon: <Sliders className="w-4 h-4" />, desc: '시각화 & 커스텀' },
    { id: 3, label: '3. 내보내기', icon: <Share2 className="w-4 h-4" />, desc: '이미지 & 코드 퍼가기' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold tracking-wider uppercase">
                Datawrapper Studio
              </div>
              
              {isEditingTitle ? (
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  autoFocus
                  className="text-sm font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-400 focus:outline-none"
                />
              ) : (
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="flex items-center gap-1.5 group text-left max-w-[220px] sm:max-w-xs"
                  title="프로젝트 제목 편집"
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
                    {projectTitle}
                  </span>
                  <Edit3 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              )}
            </div>
          </div>

          {/* Step Indicator Tabs */}
          <nav className="hidden md:flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            {steps.map((s) => {
              const isActive = step === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <span className={`${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                    {s.icon}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Admin Auth Status */}
          <div className="flex items-center gap-2">
            {auth.isAuthenticated ? (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>관리자 ({auth.username})</span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold transition-all shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>관리자 로그인</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Step Bar */}
        <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 px-2 py-1 bg-slate-50 dark:bg-slate-950 justify-around">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-1 py-1.5 px-2 text-xs font-medium rounded-lg ${
                step === s.id 
                  ? 'text-blue-600 font-bold bg-blue-50 dark:bg-blue-950/50' 
                  : 'text-slate-500'
              }`}
            >
              {s.icon}
              <span>{s.id}. {s.label.split('.')[1]}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Auth Modal */}
      <AdminAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};
