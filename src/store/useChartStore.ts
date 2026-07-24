import { create } from 'zustand';
import type { 
  ChartType, 
  StepType, 
  DataRow, 
  ChartMetadata, 
  ChartOptions, 
  UserAuth, 
  ColumnMeta, 
  ColumnDataType 
} from '../types/chart';
import { SAMPLE_DATASETS } from '../utils/sampleData';
import { PALETTES } from '../utils/palettes';
import Papa from 'papaparse';

// Helper function to auto detect column data type
export function detectColumnType(values: any[]): ColumnDataType {
  const nonEmpties = values.filter(v => v !== null && v !== undefined && String(v).trim() !== '');
  if (nonEmpties.length === 0) return 'string';

  let isNum = true;
  let isDate = true;

  for (const val of nonEmpties) {
    const s = String(val).trim();
    // Number check
    if (isNaN(Number(s)) || s === '') {
      isNum = false;
    }
    // Date check (e.g. YYYY-MM-DD or YYYY/MM/DD or ISO dates)
    const dateParsed = Date.parse(s);
    const looksLikeDate = (s.includes('-') || s.includes('/')) && !isNaN(dateParsed);
    if (!looksLikeDate) {
      isDate = false;
    }
  }

  if (isNum) return 'number';
  if (isDate) return 'date';
  return 'string';
}

interface ChartStoreState {
  // Navigation & Project
  projectTitle: string;
  step: StepType;
  
  // Data State
  chartType: ChartType;
  chartData: DataRow[]; // Central chartData state
  data: DataRow[];      // Alias for backwards compatibility
  csvRaw: string;
  rawMatrix: string[][]; // Raw 2D grid
  hasHeaderRow: boolean;
  columnsMeta: ColumnMeta[];
  xAxisKey: string;
  seriesKeys: string[];
  
  // Customization
  metadata: ChartMetadata;
  options: ChartOptions;
  
  // Auth State
  auth: UserAuth;
  
  // Actions
  setProjectTitle: (title: string) => void;
  setStep: (step: StepType) => void;
  setChartType: (chartType: ChartType) => void;
  parseCsvWithPapa: (csvText: string, useFirstRowAsHeader?: boolean) => void;
  setHasHeaderRow: (hasHeader: boolean) => void;
  setRawMatrixAndProcess: (matrix: string[][], useFirstRowAsHeader: boolean) => void;
  updateCell: (rowIndex: number, columnKey: string, value: string | number) => void;
  updateColumnLabel: (colIndex: number, newLabel: string) => void;
  updateColumnType: (colIndex: number, newType: ColumnDataType) => void;
  addRow: () => void;
  deleteRow: (rowIndex: number) => void;
  addColumn: () => void;
  deleteColumn: (colKey: string) => void;
  updateMetadata: (meta: Partial<ChartMetadata>) => void;
  updateOptions: (opts: Partial<ChartOptions>) => void;
  setPalette: (paletteId: string) => void;
  loadSampleDataset: (datasetId: string) => void;
  
  // Auth Actions
  login: (id: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
}

const defaultDataset = SAMPLE_DATASETS[0];

// Convert 2D Matrix to DataRows & ColumnMeta
function processMatrix(matrix: string[][], hasHeaderRow: boolean) {
  if (!matrix || matrix.length === 0) {
    return { dataRows: [], columnsMeta: [], xAxisKey: '', seriesKeys: [] };
  }

  let headers: string[] = [];
  let bodyRows: string[][] = [];

  if (hasHeaderRow && matrix.length > 0) {
    headers = matrix[0].map((h, i) => (h && h.trim() ? h.trim() : `Col ${i + 1}`));
    bodyRows = matrix.slice(1);
  } else {
    const colCount = matrix[0] ? matrix[0].length : 1;
    headers = Array.from({ length: colCount }, (_, i) => `Col ${i + 1}`);
    bodyRows = matrix;
  }

  // Detect Column Meta
  const columnsMeta: ColumnMeta[] = headers.map((h, colIdx) => {
    const colValues = bodyRows.map(r => r[colIdx]);
    const detectedType = detectColumnType(colValues);
    return {
      key: h,
      label: h,
      type: detectedType,
    };
  });

  const xAxisKey = columnsMeta[0]?.key || 'Category';
  const seriesKeys = columnsMeta.slice(1).map(c => c.key);

  const dataRows: DataRow[] = bodyRows.map(r => {
    const rowObj: DataRow = {};
    columnsMeta.forEach((col, cIdx) => {
      const val = r[cIdx] !== undefined ? r[cIdx] : '';
      if (col.type === 'number') {
        const num = parseFloat(val);
        rowObj[col.key] = isNaN(num) ? val : num;
      } else {
        rowObj[col.key] = val;
      }
    });
    return rowObj;
  });

  return { dataRows, columnsMeta, xAxisKey, seriesKeys };
}

export const useChartStore = create<ChartStoreState>((set, get) => ({
  projectTitle: '내 무제 데이터 시각화 프로젝트',
  step: 1,
  
  chartType: defaultDataset.chartType,
  chartData: defaultDataset.data,
  data: defaultDataset.data,
  csvRaw: defaultDataset.csvRaw,
  rawMatrix: [
    ['국가', 'GDP_조달러'],
    ['미국', '28.7'],
    ['중국', '18.5'],
    ['독일', '4.7'],
    ['일본', '4.3'],
    ['인도', '3.9'],
    ['영국', '3.5'],
    ['프랑스', '3.1'],
    ['대한민국', '1.9'],
  ],
  hasHeaderRow: true,
  columnsMeta: [
    { key: '국가', label: '국가', type: 'string' },
    { key: 'GDP_조달러', label: 'GDP_조달러', type: 'number' },
  ],
  xAxisKey: defaultDataset.xAxisKey,
  seriesKeys: defaultDataset.seriesKeys,
  
  metadata: {
    title: defaultDataset.title,
    subtitle: defaultDataset.subtitle,
    source: defaultDataset.source,
    sourceUrl: 'https://imf.org',
    footnote: '* 2024년 추정치 기준 데이터입니다.',
    unit: defaultDataset.unit,
    numberFormat: 'number',
  },
  
  options: {
    showGrid: true,
    showLegend: true,
    legendPosition: 'top',
    showValues: true,
    labelPosition: 'outside',
    animate: true,
    aspectRatio: 'responsive',
    theme: 'light',
    primaryColor: PALETTES[0].colors[0],
    cardBackgroundColor: '#ffffff',
    customColors: PALETTES[0].colors,
    selectedPaletteId: PALETTES[0].id,
  },
  
  auth: {
    isAuthenticated: false,
    username: null,
    role: null,
  },
  
  setProjectTitle: (title) => set({ projectTitle: title }),
  setStep: (step) => set({ step }),
  setChartType: (chartType) => set({ chartType }),
  
  parseCsvWithPapa: (csvText: string, useFirstRowAsHeader) => {
    const { hasHeaderRow } = get();
    const effectiveHasHeader = useFirstRowAsHeader !== undefined ? useFirstRowAsHeader : hasHeaderRow;

    Papa.parse<string[]>(csvText.trim(), {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const matrix = results.data as string[][];
        if (matrix && matrix.length > 0) {
          const { dataRows, columnsMeta, xAxisKey, seriesKeys } = processMatrix(matrix, effectiveHasHeader);
          set({
            csvRaw: csvText,
            rawMatrix: matrix,
            chartData: dataRows,
            data: dataRows,
            columnsMeta,
            xAxisKey,
            seriesKeys: seriesKeys.length > 0 ? seriesKeys : ['Value'],
            hasHeaderRow: effectiveHasHeader
          });
        }
      }
    });
  },

  setHasHeaderRow: (hasHeader) => {
    const { rawMatrix } = get();
    set({ hasHeaderRow: hasHeader });
    if (rawMatrix && rawMatrix.length > 0) {
      const { dataRows, columnsMeta, xAxisKey, seriesKeys } = processMatrix(rawMatrix, hasHeader);
      set({
        chartData: dataRows,
        data: dataRows,
        columnsMeta,
        xAxisKey,
        seriesKeys: seriesKeys.length > 0 ? seriesKeys : ['Value']
      });
    }
  },

  setRawMatrixAndProcess: (matrix, useFirstRowAsHeader) => {
    const { dataRows, columnsMeta, xAxisKey, seriesKeys } = processMatrix(matrix, useFirstRowAsHeader);
    const csvRaw = matrix.map(r => r.join(',')).join('\n');
    set({
      rawMatrix: matrix,
      csvRaw,
      chartData: dataRows,
      data: dataRows,
      columnsMeta,
      xAxisKey,
      seriesKeys: seriesKeys.length > 0 ? seriesKeys : ['Value'],
      hasHeaderRow: useFirstRowAsHeader
    });
  },

  updateCell: (rowIndex, columnKey, value) => {
    const { chartData } = get();
    const updated = [...chartData];
    const numVal = typeof value === 'string' ? parseFloat(value) : value;
    const finalVal = isNaN(numVal as number) || String(value).trim() === '' ? value : numVal;
    
    updated[rowIndex] = {
      ...updated[rowIndex],
      [columnKey]: finalVal
    };
    
    set({ chartData: updated, data: updated });
  },

  updateColumnLabel: (colIndex, newLabel) => {
    const { columnsMeta, chartData, xAxisKey } = get();
    const oldKey = columnsMeta[colIndex]?.key;
    if (!oldKey || oldKey === newLabel) return;

    const updatedCols = [...columnsMeta];
    updatedCols[colIndex] = { ...updatedCols[colIndex], key: newLabel, label: newLabel };

    const updatedRows = chartData.map(row => {
      const newRow: DataRow = {};
      Object.keys(row).forEach(k => {
        if (k === oldKey) {
          newRow[newLabel] = row[k];
        } else {
          newRow[k] = row[k];
        }
      });
      return newRow;
    });

    const newXKey = colIndex === 0 ? newLabel : xAxisKey;
    const newSeries = updatedCols.slice(1).map(c => c.key);

    set({
      columnsMeta: updatedCols,
      chartData: updatedRows,
      data: updatedRows,
      xAxisKey: newXKey,
      seriesKeys: newSeries
    });
  },

  updateColumnType: (colIndex, newType) => {
    const { columnsMeta, chartData } = get();
    const targetCol = columnsMeta[colIndex];
    if (!targetCol) return;

    const updatedCols = [...columnsMeta];
    updatedCols[colIndex] = { ...updatedCols[colIndex], type: newType };

    // Re-coerce row values if changed to number
    const updatedRows = chartData.map(row => {
      const val = row[targetCol.key];
      let coercedVal = val;
      if (newType === 'number' && typeof val === 'string') {
        const num = parseFloat(val);
        if (!isNaN(num)) coercedVal = num;
      }
      return { ...row, [targetCol.key]: coercedVal };
    });

    set({ columnsMeta: updatedCols, chartData: updatedRows, data: updatedRows });
  },

  addRow: () => {
    const { chartData, columnsMeta } = get();
    const newRow: DataRow = {};
    columnsMeta.forEach((col, idx) => {
      newRow[col.key] = col.type === 'number' ? 0 : `항목 ${chartData.length + 1}`;
    });
    const updated = [...chartData, newRow];
    set({ chartData: updated, data: updated });
  },

  deleteRow: (rowIndex) => {
    const { chartData } = get();
    if (chartData.length <= 1) return;
    const updated = chartData.filter((_, idx) => idx !== rowIndex);
    set({ chartData: updated, data: updated });
  },

  addColumn: () => {
    const { columnsMeta, chartData, seriesKeys } = get();
    const newColKey = `새시리즈_${columnsMeta.length}`;
    const newCol: ColumnMeta = { key: newColKey, label: newColKey, type: 'number' };
    
    const updatedCols = [...columnsMeta, newCol];
    const updatedRows = chartData.map(row => ({ ...row, [newColKey]: 10 }));
    
    set({
      columnsMeta: updatedCols,
      chartData: updatedRows,
      data: updatedRows,
      seriesKeys: [...seriesKeys, newColKey]
    });
  },

  deleteColumn: (colKey) => {
    const { columnsMeta, chartData, xAxisKey } = get();
    if (columnsMeta.length <= 1) return;
    
    const updatedCols = columnsMeta.filter(c => c.key !== colKey);
    const updatedRows = chartData.map(row => {
      const newRow = { ...row };
      delete newRow[colKey];
      return newRow;
    });

    const newXKey = updatedCols[0]?.key || 'Category';
    const newSeries = updatedCols.slice(1).map(c => c.key);

    set({
      columnsMeta: updatedCols,
      chartData: updatedRows,
      data: updatedRows,
      xAxisKey: newXKey,
      seriesKeys: newSeries
    });
  },
  
  updateMetadata: (meta) => set((state) => ({
    metadata: { ...state.metadata, ...meta }
  })),
  
  updateOptions: (opts) => set((state) => ({
    options: { ...state.options, ...opts }
  })),
  
  setPalette: (paletteId) => {
    const found = PALETTES.find(p => p.id === paletteId);
    if (found) {
      set((state) => ({
        options: {
          ...state.options,
          selectedPaletteId: found.id,
          customColors: found.colors
        }
      }));
    }
  },
  
  loadSampleDataset: (datasetId) => {
    const ds = SAMPLE_DATASETS.find(d => d.id === datasetId);
    if (ds) {
      const matrix: string[][] = [
        [ds.xAxisKey, ...ds.seriesKeys],
        ...ds.data.map(row => [String(row[ds.xAxisKey]), ...ds.seriesKeys.map(k => String(row[k]))])
      ];

      const { dataRows, columnsMeta } = processMatrix(matrix, true);

      set({
        chartType: ds.chartType,
        chartData: dataRows,
        data: dataRows,
        csvRaw: ds.csvRaw,
        rawMatrix: matrix,
        hasHeaderRow: true,
        columnsMeta,
        xAxisKey: ds.xAxisKey,
        seriesKeys: ds.seriesKeys,
        metadata: {
          title: ds.title,
          subtitle: ds.description,
          source: ds.source,
          sourceUrl: '',
          footnote: '* 데이터 출처 정보가 반영되어 있습니다.',
          unit: ds.unit,
          numberFormat: 'number',
        }
      });
    }
  },
  
  login: (id, pass) => {
    if (id === 'admin' && pass === '123jesus') {
      const authState: UserAuth = {
        isAuthenticated: true,
        username: 'admin',
        role: 'admin',
      };
      set({ auth: authState });
      return { success: true };
    }
    return { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' };
  },
  
  logout: () => {
    set({
      auth: {
        isAuthenticated: false,
        username: null,
        role: null,
      }
    });
  }
}));
