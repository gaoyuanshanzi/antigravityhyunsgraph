import React, { useState } from 'react';
import { useChartStore } from '../../store/useChartStore';
import { X, Copy, Check, Code, Frame, Sparkles } from 'lucide-react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const { projectTitle, metadata, options } = useChartStore();
  const [embedWidth, setEmbedWidth] = useState<'100%' | '600px' | '800px'>('100%');
  const [embedHeight, setEmbedHeight] = useState<number>(480);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const iframeSnippet = `<iframe
  src="https://datawrapper-studio.vercel.app/embed/chart-live"
  title="${metadata.title || projectTitle}"
  width="${embedWidth}"
  height="${embedHeight}px"
  scrolling="no"
  frameborder="0"
  style="border: 0; border-radius: 12px; width: ${embedWidth}; height: ${embedHeight}px; overflow: hidden;"
></iframe>`;

  const responsiveSnippet = `<div style="min-width: 320px; max-width: 100%; margin: 0 auto;">
  ${iframeSnippet}
  <script type="text/javascript">
    !function(){"use strict";window.addEventListener("message",(function(a){if(void 0!==a.data["datawrapper-height"])for(var e in a.data["datawrapper-height"]){var t=document.getElementById("datawrapper-chart-"+e);if(t)t.style.height=a.data["datawrapper-height"][e]+"px"}}))}();
  </script>
</div>`;

  const handleCopy = (snippet: string, type: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedType(type);
    onShowToast('클립보드에 퍼가기 코드가 복사되었습니다!');
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                반응형 Embed 퍼가기 코드 생성기
              </h3>
              <p className="text-xs text-slate-500">
                원하는 가로/세로 비율을 지정하여 HTML iframe 코드를 복사하세요.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Controls: Width & Height */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Frame className="w-3.5 h-3.5 text-blue-500" />
                가로 너비 (Width)
              </label>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                {(['100%', '600px', '800px'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setEmbedWidth(w)}
                    className={`flex-1 py-1 rounded text-[11px] font-medium transition-all ${
                      embedWidth === w
                        ? 'bg-blue-600 text-white font-bold shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                높이 (Height: {embedHeight}px)
              </label>
              <input
                type="range"
                min={300}
                max={800}
                step={20}
                value={embedHeight}
                onChange={(e) => setEmbedHeight(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Snippet 1: Standard iframe Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                1. 표준 반응형 iframe 코드 (Standard Embed)
              </span>
              <span className="text-[10px] text-slate-400">자동 높이 반응 지원</span>
            </div>

            <div className="relative">
              <pre className="p-3.5 bg-slate-950 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
                {iframeSnippet}
              </pre>

              <button
                onClick={() => handleCopy(iframeSnippet, 'iframe')}
                className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-all flex items-center gap-1 shadow-md shadow-blue-600/30"
              >
                {copiedType === 'iframe' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>코드 복사 (Copy)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Snippet 2: Auto-resizing Script Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                2. 스크립트 포함 반응형 퍼가기 (Responsive + Script)
              </span>
              <span className="text-[10px] text-slate-400">Datawrapper 고유 자동 조절 스크립트</span>
            </div>

            <div className="relative">
              <pre className="p-3.5 bg-slate-950 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed max-h-32">
                {responsiveSnippet}
              </pre>

              <button
                onClick={() => handleCopy(responsiveSnippet, 'script')}
                className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold transition-all flex items-center gap-1 shadow-xs"
              >
                {copiedType === 'script' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>스크립트 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Datawrapper Studio Embed Service
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
