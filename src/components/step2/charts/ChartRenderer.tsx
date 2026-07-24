import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { useChartStore } from '../../../store/useChartStore';

import { D3HorizontalBarChart } from './D3HorizontalBarChart';

export const ChartRenderer: React.FC = () => {
  const { chartType, chartData: data, xAxisKey, seriesKeys, options } = useChartStore();
  const colors = options.customColors && options.customColors.length > 0
    ? options.customColors
    : ['#2563eb', '#38bdf8', '#34d399', '#f59e0b', '#f43f5e', '#8b5cf6'];

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6M9 12h6M9 15h4"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="font-medium text-slate-500">표시할 데이터가 없습니다</p>
          <p className="text-xs mt-0.5">Step 1에서 데이터를 입력하거나 샘플 데이터를 불러오세요</p>
        </div>
      </div>
    );
  }

  // Common Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-xs text-white p-3 rounded-lg shadow-xl text-xs border border-slate-700 space-y-1">
          <p className="font-semibold text-slate-200 border-b border-slate-700 pb-1 mb-1">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name || entry.dataKey}:
              </span>
              <span className="font-mono font-bold">{entry.value?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  switch (chartType) {
    case 'd3-bar':
    case 'bar':
      // D3.js SVG Horizontal Bar Chart (Datawrapper Signature)
      return <D3HorizontalBarChart />;

    case 'column':
      // Vertical Column Chart
      return (
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            {options.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />}
            <XAxis dataKey={xAxisKey} tickLine={false} tick={{ fontSize: 12, fill: '#334155', fontWeight: 500 }} />
            <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            {options.showLegend && <Legend verticalAlign={options.legendPosition} wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />}
            {seriesKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[idx % colors.length]}
                radius={[4, 4, 0, 0]}
                isAnimationActive={options.animate}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );

    case 'line':
      return (
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            {options.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />}
            <XAxis dataKey={xAxisKey} tickLine={false} tick={{ fontSize: 12, fill: '#334155', fontWeight: 500 }} />
            <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            {options.showLegend && <Legend verticalAlign={options.legendPosition} wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />}
            {seriesKeys.map((key, idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[idx % colors.length]}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
                activeDot={{ r: 7 }}
                isAnimationActive={options.animate}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );

    case 'area':
      return (
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            {options.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />}
            <XAxis dataKey={xAxisKey} tickLine={false} tick={{ fontSize: 12, fill: '#334155', fontWeight: 500 }} />
            <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            {options.showLegend && <Legend verticalAlign={options.legendPosition} wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />}
            {seriesKeys.map((key, idx) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                fillOpacity={0.25}
                strokeWidth={2.5}
                isAnimationActive={options.animate}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'pie':
    case 'donut': {
      const seriesKey = seriesKeys[0] || 'Value';
      const isDonut = chartType === 'donut';
      return (
        <ResponsiveContainer width="100%" height={380}>
          <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <Pie
              data={data}
              dataKey={seriesKey}
              nameKey={xAxisKey}
              cx="50%"
              cy="50%"
              outerRadius={130}
              innerRadius={isDonut ? 70 : 0}
              paddingAngle={isDonut ? 3 : 0}
              isAnimationActive={options.animate}
              label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(1)}%)`}
              labelLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {options.showLegend && <Legend verticalAlign={options.legendPosition} wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />}
          </PieChart>
        </ResponsiveContainer>
      );
    }

    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height={380}>
          <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            {options.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
            <XAxis dataKey={xAxisKey} type="category" tickLine={false} tick={{ fontSize: 12, fill: '#334155' }} />
            <YAxis type="number" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            {options.showLegend && <Legend verticalAlign={options.legendPosition} wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />}
            {seriesKeys.map((key, idx) => (
              <Scatter
                key={key}
                name={key}
                data={data}
                fill={colors[idx % colors.length]}
                isAnimationActive={options.animate}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      );

    case 'radar':
      return (
        <ResponsiveContainer width="100%" height={380}>
          <RadarChart cx="50%" cy="50%" outerRadius={120} data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey={xAxisKey} tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            {seriesKeys.map((key, idx) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                fillOpacity={0.4}
                isAnimationActive={options.animate}
              />
            ))}
            <Tooltip content={<CustomTooltip />} />
            {options.showLegend && <Legend verticalAlign={options.legendPosition} wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />}
          </RadarChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
};
