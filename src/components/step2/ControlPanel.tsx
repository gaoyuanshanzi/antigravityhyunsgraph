import React from 'react';
import { useChartStore } from '../../store/useChartStore';
import { PALETTES } from '../../utils/palettes';
import type { ChartType } from '../../types/chart';
import { 
  BarChart, 
  BarChartHorizontal, 
  TrendingUp, 
  AreaChart, 
  PieChart, 
  CircleDot, 
  ScatterChart, 
  Hexagon, 
  Palette, 
  Type, 
  SlidersHorizontal,
  Check,
  Paintbrush,
  Tag,
  Eye
} from 'lucide-react';

interface ChartTypeOption {
  id: ChartType;
  label: string;
  icon: React.ReactNode;
}

export const ControlPanel: React.FC = () => {
  const { 
    chartType, 
    setChartType, 
    metadata, 
    updateMetadata, 
    options, 
    updateOptions, 
    setPalette 
  } = useChartStore();

  const chartTypes: ChartTypeOption[] = [
    { id: 'bar', label: 'D3 가로막대', icon: <BarChartHorizontal className="w-5 h-5 text-blue-600" /> },
    { id: 'column', label: '세로 막대', icon: <BarChart className="w-5 h-5" /> },
    { id: 'line', label: '꺾은선', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'area', label: '영역', icon: <AreaChart className="w-5 h-5" /> },
    { id: 'pie', label: '파이', icon: <PieChart className="w-5 h-5" /> },
    { id: 'donut', label: '도넛', icon: <CircleDot className="w-5 h-5" /> },
    { id: 'scatter', label: '산점도', icon: <ScatterChart className="w-5 h-5" /> },
    { id: 'radar', label: '레이더', icon: <Hexagon className="w-5 h-5" /> },
  ];

  const bgPresets = [
    { label: '화이트 (White)', hex: '#ffffff' },
    { label: '다크 (Dark)', hex: '#0f172a' },
    { label: '페이퍼 (Paper)', hex: '#f8f6f0' },
    { label: '슬레이트 (Slate)', hex: '#f1f5f9' },
  ];

  const handleBarColorChange = (colorHex: string) => {
    const updatedColors = [...options.customColors];
    updatedColors[0] = colorHex;
    updateOptions({
      primaryColor: colorHex,
      customColors: updatedColors,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
      
      {/* 1. Chart Type Selection Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <BarChart className="w-4 h-4 text-blue-500" />
          차트 유형 선택 (Chart Type)
        </label>
        
        <div className="grid grid-cols-4 gap-2">
          {chartTypes.map((t) => {
            const isSelected = chartType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setChartType(t.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="mb-1">{t.icon}</div>
                <span className="text-[11px] truncate w-full text-center">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* 2. Text Controls Form (Title, Description, Source, Footnote) */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Type className="w-4 h-4 text-blue-500" />
          텍스트 컨트롤 (Text Inputs)
        </label>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
              차트 제목 (Title, Bold)
            </label>
            <input
              type="text"
              value={metadata.title}
              onChange={(e) => updateMetadata({ title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
              부제목 / 설명 (Description)
            </label>
            <textarea
              rows={2}
              value={metadata.subtitle}
              onChange={(e) => updateMetadata({ subtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              placeholder="부제목이나 커스텀 코멘트를 입력하세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                출처 (Source)
              </label>
              <input
                type="text"
                value={metadata.source}
                onChange={(e) => updateMetadata({ source: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="예: IMF, 한국은행"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                각주 / 주석 (Footnote)
              </label>
              <input
                type="text"
                value={metadata.footnote}
                onChange={(e) => updateMetadata({ footnote: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="예: * 2024년 추정치"
              />
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* 3. Color Controls (Main Bar Picker, Background Selector, Palettes) */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Paintbrush className="w-4 h-4 text-blue-500" />
          색상 설정 (Color Settings)
        </label>

        {/* Main Bar Color Picker */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
            메인 막대 색상 (Bar Color)
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={options.primaryColor || options.customColors[0] || '#2563eb'}
              onChange={(e) => handleBarColorChange(e.target.value)}
              className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
            />
            <span className="font-mono text-xs text-slate-600 dark:text-slate-400 uppercase">
              {options.primaryColor || options.customColors[0] || '#2563eb'}
            </span>
          </div>
        </div>

        {/* Card Background Color Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
            차트 카드 배경색 선택 (Background)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {bgPresets.map((bg) => (
              <button
                key={bg.hex}
                onClick={() => updateOptions({ cardBackgroundColor: bg.hex })}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                  options.cardBackgroundColor === bg.hex
                    ? 'border-blue-500 bg-blue-50/40 text-blue-600 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{bg.label}</span>
                <span 
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs" 
                  style={{ backgroundColor: bg.hex }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Color Palettes Selector */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
            컬러 팔레트 프리셋
          </label>
          {PALETTES.map((pal) => {
            const isSelected = options.selectedPaletteId === pal.id;
            return (
              <button
                key={pal.id}
                onClick={() => setPalette(pal.id)}
                className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {pal.name}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>

                <div className="flex items-center gap-1">
                  {pal.colors.slice(0, 5).map((c, idx) => (
                    <span
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* 4. Axis & Label Controls (Grid lines, Label position, Number suffix) */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <SlidersHorizontal className="w-4 h-4 text-blue-500" />
          축 & 레이블 설정 (Axis & Labels)
        </label>

        <div className="space-y-3 text-xs">
          
          {/* X-Axis Grid Line Checkbox */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              X축 가이드라인 (Grid Line) 표시
            </span>
            <input
              type="checkbox"
              checked={options.showGrid}
              onChange={(e) => updateOptions({ showGrid: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          {/* Data Label Position Selector */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1.5 font-medium">
              데이터 레이블 위치 (Label Position)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateOptions({ labelPosition: 'outside' })}
                className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                  options.labelPosition === 'outside'
                    ? 'border-blue-500 bg-blue-50 text-blue-600 font-bold shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                }`}
              >
                막대 바깥쪽 (Outside)
              </button>

              <button
                onClick={() => updateOptions({ labelPosition: 'inside' })}
                className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                  options.labelPosition === 'inside'
                    ? 'border-blue-500 bg-blue-50 text-blue-600 font-bold shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                }`}
              >
                막대 안쪽 (Inside)
              </button>
            </div>
          </div>

          {/* Number Suffix Input */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-blue-500" />
              숫자 접미사 / 단위 (Suffix)
            </label>
            <input
              type="text"
              value={metadata.unit}
              onChange={(e) => updateMetadata({ unit: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
              placeholder="예: %, 원, 조 달러, 개"
            />
          </div>

        </div>
      </div>

    </div>
  );
};
