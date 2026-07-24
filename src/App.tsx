import React from 'react';
import { useChartStore } from './store/useChartStore';
import { Navbar } from './components/layout/Navbar';
import { DataInputPanel } from './components/step1/DataInputPanel';
import { ControlPanel } from './components/step2/ControlPanel';
import { ChartPreviewCanvas } from './components/step2/ChartPreviewCanvas';
import { ExportPanel } from './components/step3/ExportPanel';
import { Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

export function App() {
  const { step, setStep, auth } = useChartStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-12">
        {step === 1 && <DataInputPanel />}

        {step === 2 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              
              {/* Left Control Panel (Options & Styling) */}
              <div className="w-full lg:w-[380px] shrink-0">
                <ControlPanel />
              </div>

              {/* Right Realtime Live Chart Preview Canvas */}
              <div className="w-full flex-1 flex flex-col space-y-4">
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      STEP 2
                    </span>
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      차트 커스터마이징 & 실시간 캔버스
                    </h2>
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 group"
                  >
                    <span>내보내기 단계로</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <ChartPreviewCanvas />
              </div>

            </div>
          </div>
        )}

        {step === 3 && <ExportPanel />}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Datawrapper Studio Framework</span>
            <span>•</span>
            <span>React, TypeScript & Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Admin status: {auth.isAuthenticated ? 'Logged In (admin)' : 'Guest'}</span>
            <span>•</span>
            <span>© 2026 Antigravity Data Viz Engine</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
