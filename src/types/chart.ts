export type ChartType = 
  | 'bar' 
  | 'd3-bar'
  | 'column' 
  | 'line' 
  | 'area' 
  | 'pie' 
  | 'donut' 
  | 'scatter' 
  | 'radar';

export type StepType = 1 | 2 | 3;

export type ColumnDataType = 'string' | 'number' | 'date';

export interface ColumnMeta {
  key: string;
  label: string;
  type: ColumnDataType;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  background: string;
  textColor: string;
}

export interface DataRow {
  [key: string]: string | number;
}

export interface ChartMetadata {
  title: string;
  subtitle: string;
  source: string;
  sourceUrl: string;
  footnote: string;
  unit: string; // Suffix (예: %, 원, 조 달러)
  numberFormat: 'number' | 'currency' | 'percent';
}

export interface ChartOptions {
  showGrid: boolean;
  showLegend: boolean;
  legendPosition: 'top' | 'bottom';
  showValues: boolean;
  labelPosition: 'inside' | 'outside'; // 막대 안쪽 / 막대 바깥쪽
  animate: boolean;
  aspectRatio: 'responsive' | '16:9' | '4:3' | '1:1';
  theme: 'light' | 'dark' | 'paper';
  primaryColor: string; // 메인 막대 색상
  cardBackgroundColor: string; // 배경색 선택
  customColors: string[];
  selectedPaletteId: string;
}

export interface UserAuth {
  isAuthenticated: boolean;
  username: string | null;
  role: 'admin' | 'guest' | null;
}
