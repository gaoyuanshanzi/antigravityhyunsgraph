import React, { useState } from 'react';
import { useChartStore } from '../../store/useChartStore';
import { ChartRenderer } from './charts/ChartRenderer';
import { Monitor, Tablet, Smartphone, Sparkles, ExternalLink } from 'lucide-react';

export const ChartPreviewCanvas: React.FC = () => {
  const { metadata, options } = useChartStore();
  const [viewportWidth, setViewportWidth] = useState<'full' | 'desktop' | 'tablet' | 'mobile'>('full');

  const getContainerWidth = () => {
    switch (viewportWidth) {
      case 'desktop': return 'max-w-[760px]';
      case 'tablet': return 'max-w-[560px]';
      case 'mobile': return 'max-w-[380px]';
      default: return 'w-full';
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      {/* Top Device Viewport Switcher */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>반응형 미리보기 캔버스 (Datawrapper Card Style)</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setViewportWidth('full')}
            className={`p-1.5 rounded-md flex items-center gap-1 transition-all ${
              viewportWidth === 'full' 
                ? 'bg-white dark:bg-slate-900 text-blue-600 font-bold shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="전체 너비 (Full Responsive)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">100%</span>
          </button>
          <button
            onClick={() => setViewportWidth('desktop')}
            className={`p-1.5 rounded-md flex items-center gap-1 transition-all ${
              viewportWidth === 'desktop' 
                ? 'bg-white dark:bg-slate-900 text-blue-600 font-bold shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="데스크톱 (760px)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">760px</span>
          </button>
          <button
            onClick={() => setViewportWidth('tablet')}
            className={`p-1.5 rounded-md flex items-center gap-1 transition-all ${
              viewportWidth === 'tablet' 
                ? 'bg-white dark:bg-slate-900 text-blue-600 font-bold shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="태블릿 (560px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">560px</span>
          </button>
          <button
            onClick={() => setViewportWidth('mobile')}
            className={`p-1.5 rounded-md flex items-center gap-1 transition-all ${
              viewportWidth === 'mobile' 
                ? 'bg-white dark:bg-slate-900 text-blue-600 font-bold shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="모바일 (380px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">380px</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container with Viewport Width */}
      <div className="flex justify-center w-full transition-all duration-300">
        
        {/* Datawrapper Signature Card Element */}
        <div 
          id="datawrapper-export-canvas"
          className={`${getContainerWidth()} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl transition-all duration-300 flex flex-col space-y-4`}
          style={{
            backgroundColor: options.cardBackgroundColor || (options.selectedPaletteId === 'dark-elegant' ? '#0f172a' : '#ffffff'),
            color: options.cardBackgroundColor === '#0f172a' || options.cardBackgroundColor === '#1e293b' || options.selectedPaletteId === 'dark-elegant' ? '#f8fafc' : '#0f172a'
          }}
        >
          {/* Card Header (Datawrapper Style: Large Bold Title + Light Subtitle) */}
          <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-snug">
              {metadata.title || '무제 차트 제목'}
            </h1>
            {metadata.subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                {metadata.subtitle}
              </p>
            )}
            {metadata.unit && (
              <div className="pt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
                [단위: {metadata.unit}]
              </div>
            )}
          </div>

          {/* Chart Rendering Canvas Area */}
          <div className="w-full py-2 min-h-[360px] flex items-center justify-center">
            <ChartRenderer />
          </div>

          {/* Card Footer (Datawrapper Style: Source & Footnote + Attribution) */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
            <div className="space-y-0.5">
              {metadata.source && (
                <div className="flex items-center gap-1 font-medium">
                  <span>출처:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{metadata.source}</span>
                  {metadata.sourceUrl && (
                    <a 
                      href={metadata.sourceUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-blue-500 hover:underline flex items-center gap-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
              {metadata.footnote && (
                <div className="text-slate-400 dark:text-slate-500 italic">
                  {metadata.footnote}
                </div>
              )}
            </div>

            {/* Datawrapper Brand Attribution Watermark */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto text-slate-400 dark:text-slate-500 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Created with Datawrapper Studio</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
