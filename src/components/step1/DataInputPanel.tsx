import React, { useRef, useState } from 'react';
import { useChartStore } from '../../store/useChartStore';
import { SAMPLE_DATASETS } from '../../utils/sampleData';
import type { ColumnDataType } from '../../types/chart';
import Papa from 'papaparse';
import { 
  FileSpreadsheet, 
  Upload, 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowRight,
  CheckCircle2,
  Table as TableIcon,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  ToggleRight,
  FileText,
  AlertCircle
} from 'lucide-react';

export const DataInputPanel: React.FC = () => {
  const { 
    csvRaw, 
    parseCsvWithPapa, 
    chartData, 
    columnsMeta, 
    hasHeaderRow, 
    setHasHeaderRow, 
    updateCell, 
    updateColumnLabel, 
    updateColumnType, 
    addRow, 
    deleteRow, 
    addColumn, 
    deleteColumn, 
    loadSampleDataset, 
    setStep 
  } = useChartStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Handle direct text change in textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setParseError(null);
    parseCsvWithPapa(val, hasHeaderRow);
  };

  // Handle CSV/TSV File Upload via PapaParse
  const handleFileUpload = (file: File) => {
    if (!file) return;
    setParseError(null);

    Papa.parse<string[]>(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          console.warn('PapaParse warnings:', results.errors);
        }
        if (results.data && results.data.length > 0) {
          const csvText = results.data.map(r => r.join(',')).join('\n');
          parseCsvWithPapa(csvText, hasHeaderRow);
        } else {
          setParseError('파일 파싱에 실패하였거나 빈 파일입니다.');
        }
      },
      error: (err) => {
        setParseError(`파일 읽기 오류: ${err.message}`);
      }
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Column Type Icon & Badge Helper
  const getTypeBadge = (type: ColumnDataType) => {
    switch (type) {
      case 'number':
        return {
          icon: <Hash className="w-3 h-3" />,
          label: '숫자',
          bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
        };
      case 'date':
        return {
          icon: <Calendar className="w-3 h-3" />,
          label: '날짜',
          bg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
        };
      default:
        return {
          icon: <Type className="w-3 h-3" />,
          label: '문자열',
          bg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
              STEP 1
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              데이터 입력 및 자동 검증 (Data Input & Validation)
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            CSV/TSV 파일을 업로드하거나 텍스트를 직접 붙여넣으세요. 열별 데이터 타입이 자동으로 감지됩니다.
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            추천 샘플 데이터셋:
          </span>
          {SAMPLE_DATASETS.map((ds) => (
            <button
              key={ds.id}
              onClick={() => loadSampleDataset(ds.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>{ds.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar: First Row as Header Toggle & File Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-100/70 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
        
        {/* Toggle: First Row as Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHasHeaderRow(!hasHeaderRow)}
            className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors"
          >
            {hasHeaderRow ? (
              <ToggleRight className="w-6 h-6 text-blue-600" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-400" />
            )}
            <span>첫 번째 행을 데이터 헤더(Header)로 사용</span>
          </button>
          <span className="text-[11px] text-slate-500">
            ({hasHeaderRow ? '첫 행 = 컬럼명' : '첫 행도 데이터로 포함'})
          </span>
        </div>

        {/* Upload File trigger */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            accept=".csv,.tsv,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4 text-blue-500" />
            <span>CSV / TSV 파일 업로드</span>
          </button>
        </div>
      </div>

      {/* Main Container: Left PapaParse Raw Area + Right Spreadsheet Grid Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: CSV/TSV Text Paste Area with Drag & Drop */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border ${
            dragActive ? 'border-blue-500 bg-blue-50/20' : 'border-slate-200 dark:border-slate-800'
          } shadow-xs flex flex-col space-y-3 transition-colors`}
        >
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-500" />
              텍스트 직접 붙여넣기 (Comma / Tab 구분)
            </label>
            <span className="text-[11px] text-slate-400">PapaParse 파서 적용</span>
          </div>

          {parseError && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          <textarea
            value={csvRaw}
            onChange={handleTextareaChange}
            rows={15}
            placeholder={`국가,GDP_조달러\n미국,28.7\n중국,18.5\n독일,4.7`}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />

          <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              컴마(,) 및 탭(\t) 구분을 자동 인식합니다. 파싱된 데이터는 오른쪽 프리뷰 테이블과 <code className="bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded font-mono">chartData</code> 스토어에 실시간 연동됩니다.
            </div>
          </div>
        </div>

        {/* Right: Spreadsheet Preview Table UI */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col space-y-3">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                스프레드시트 프리뷰 테이블 (chartData)
              </h3>
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 text-xs font-semibold rounded-md">
                {chartData.length}행 x {columnsMeta.length}열
              </span>
            </div>

            {/* Add Column Button */}
            <button
              onClick={addColumn}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-blue-500" />
              <span>열(Column) 추가</span>
            </button>
          </div>

          {/* Interactive Spreadsheet Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl max-h-[440px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              
              {/* Header with Editable Labels & Type Badges */}
              <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-2 w-10 text-center text-slate-400 font-mono text-[11px]">#</th>
                  {columnsMeta.map((col, cIdx) => {
                    const badge = getTypeBadge(col.type);
                    return (
                      <th key={col.key} className="p-2 min-w-[140px] border-r border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex flex-col space-y-1.5">
                          
                          {/* Column Title Editable Input & Delete */}
                          <div className="flex items-center justify-between gap-1">
                            <input
                              type="text"
                              value={col.label}
                              onChange={(e) => updateColumnLabel(cIdx, e.target.value)}
                              className="w-full px-1.5 py-0.5 rounded font-bold text-slate-900 dark:text-slate-100 bg-transparent hover:bg-white dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-xs"
                            />
                            {columnsMeta.length > 1 && (
                              <button
                                onClick={() => deleteColumn(col.key)}
                                className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition-colors"
                                title="열 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Data Type Auto Detection Badge & Override Selector */}
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold flex items-center gap-1 ${badge.bg}`}>
                              {badge.icon}
                              <span>{badge.label}</span>
                            </span>

                            <select
                              value={col.type}
                              onChange={(e) => updateColumnType(cIdx, e.target.value as ColumnDataType)}
                              className="text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-slate-600 dark:text-slate-400 focus:outline-none"
                            >
                              <option value="string">문자열 (String)</option>
                              <option value="number">숫자 (Number)</option>
                              <option value="date">날짜 (Date)</option>
                            </select>
                          </div>

                        </div>
                      </th>
                    );
                  })}
                  <th className="p-2 w-10 text-center"></th>
                </tr>
              </thead>

              {/* Body: Editable Data Rows */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {chartData.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="p-2 text-center text-slate-400 font-mono text-[11px]">
                      {rIdx + 1}
                    </td>

                    {columnsMeta.map((col) => (
                      <td key={col.key} className="p-1 border-r border-slate-100 dark:border-slate-800">
                        <input
                          type={col.type === 'number' ? 'number' : 'text'}
                          value={row[col.key] !== undefined ? String(row[col.key]) : ''}
                          onChange={(e) => updateCell(rIdx, col.key, e.target.value)}
                          className={`w-full px-2 py-1 rounded bg-transparent border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none transition-all ${
                            col.type === 'number' ? 'font-mono text-right' : 'text-left'
                          }`}
                        />
                      </td>
                    ))}

                    <td className="p-1 text-center">
                      <button
                        onClick={() => deleteRow(rIdx)}
                        className="text-slate-300 group-hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1 rounded transition-all"
                        title="행 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Controls & Proceed */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={addRow}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-blue-500" />
              <span>+ 새 행(Row) 추가</span>
            </button>

            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 group"
            >
              <span>차트 선택/설정으로 이동</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
