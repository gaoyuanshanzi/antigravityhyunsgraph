import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useChartStore } from '../../../store/useChartStore';
import type { DataRow } from '../../../types/chart';

interface D3HorizontalBarChartProps {
  data?: DataRow[];
  primaryColor?: string;
  showGridLines?: boolean;
  fontSize?: number;
}

export const D3HorizontalBarChart: React.FC<D3HorizontalBarChartProps> = ({
  data: propData,
  primaryColor: propColor,
  showGridLines: propShowGrid,
  fontSize: propFontSize = 13,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);

  const { chartData, xAxisKey, seriesKeys, metadata, options } = useChartStore();

  const data = propData || chartData;
  const color = propColor || (options.customColors && options.customColors[0]) || '#2563eb';
  const showGrid = propShowGrid !== undefined ? propShowGrid : options.showGrid;
  const seriesKey = seriesKeys[0] || 'Value';

  // Responsive ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const width = entries[0].contentRect.width;
      if (width > 0) {
        setContainerWidth(width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Formatter for values (thousands separator + unit)
  const formatValue = (val: number | string) => {
    if (typeof val !== 'number' && isNaN(Number(val))) return String(val);
    const num = Number(val);
    const formattedNum = num.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
    return metadata.unit ? `${formattedNum} ${metadata.unit}` : formattedNum;
  };

  // D3 SVG Render Effect
  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous renders

    // Margins & Dimensions
    const margin = { top: 20, right: 90, bottom: 30, left: 100 };
    const barHeight = Math.max(32, Math.min(48, 320 / data.length));
    const height = margin.top + margin.bottom + data.length * barHeight;
    const width = Math.max(300, containerWidth);

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Categorical Y Scale
    const categories = data.map((d) => String(d[xAxisKey] ?? ''));
    const yScale = d3
      .scaleBand()
      .domain(categories)
      .range([0, chartHeight])
      .padding(0.25);

    // Linear X Scale
    const maxVal = d3.max(data, (d) => Number(d[seriesKey]) || 0) || 10;
    const xScale = d3
      .scaleLinear()
      .domain([0, maxVal * 1.12]) // 12% padding for right labels
      .nice()
      .range([0, chartWidth]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 1. Grid Lines (X-Axis Vertical Grid)
    if (showGrid) {
      const gridTicks = xScale.ticks(5);
      g.append('g')
        .attr('class', 'grid-lines')
        .selectAll('line')
        .data(gridTicks)
        .enter()
        .append('line')
        .attr('x1', (d) => xScale(d))
        .attr('x2', (d) => xScale(d))
        .attr('y1', 0)
        .attr('y2', chartHeight)
        .attr('stroke', '#e2e8f0')
        .attr('stroke-dasharray', '3 3')
        .attr('stroke-width', 1);
    }

    // 2. Y-Axis Category Labels (Left aligned with Datawrapper clean style)
    const yAxisGroup = g
      .append('g')
      .attr('class', 'y-axis')
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .attr('x', -10)
      .attr('y', (d) => (yScale(String(d[xAxisKey])) || 0) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', '#1e293b')
      .attr('font-size', `${propFontSize}px`)
      .attr('font-weight', '600')
      .text((d) => String(d[xAxisKey]));

    // 3. Bars (D3 Rect elements with smooth hover animation)
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', (d) => yScale(String(d[xAxisKey])) || 0)
      .attr('height', yScale.bandwidth())
      .attr('x', 0)
      .attr('width', 0) // animate width from 0
      .attr('fill', color)
      .attr('rx', 4) // Rounded bar right end
      .attr('ry', 4)
      .style('cursor', 'pointer')
      .on('mouseenter', function () {
        d3.select(this).attr('fill-opacity', 0.85);
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill-opacity', 1);
      })
      .transition()
      .duration(options.animate ? 650 : 0)
      .ease(d3.easeCubicOut)
      .attr('width', (d) => Math.max(2, xScale(Number(d[seriesKey]) || 0)));

    const isInsideLabel = options.labelPosition === 'inside';

    // 4. Precise Value Labels (Inside or Outside Bar)
    g.selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('y', (d) => (yScale(String(d[xAxisKey])) || 0) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', isInsideLabel ? 'end' : 'start')
      .attr('fill', isInsideLabel ? '#ffffff' : '#334155')
      .attr('font-size', `${propFontSize - 1}px`)
      .attr('font-weight', '700')
      .attr('font-family', 'monospace')
      .attr('x', 0)
      .attr('opacity', 0)
      .text((d) => formatValue(Number(d[seriesKey]) || 0))
      .transition()
      .duration(options.animate ? 650 : 0)
      .ease(d3.easeCubicOut)
      .attr('x', (d) => {
        const barW = xScale(Number(d[seriesKey]) || 0);
        return isInsideLabel ? Math.max(12, barW - 8) : barW + 8;
      })
      .attr('opacity', 1);

    // 5. Zero Axis Line (Left Baseline)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', '#475569')
      .attr('stroke-width', 1.5);
  }, [data, containerWidth, color, showGrid, xAxisKey, seriesKey, propFontSize, metadata, options.animate]);

  return (
    <div ref={containerRef} className="w-full flex flex-col space-y-3">
      {/* Datawrapper Header (Title & Subtitle) */}
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {metadata.title || 'D3 가로 막대 차트'}
        </h2>
        {metadata.subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {metadata.subtitle}
          </p>
        )}
      </div>

      {/* D3 SVG Canvas */}
      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} className="w-full h-auto overflow-visible" />
      </div>

      {/* Datawrapper Footer (Source & Footnote) */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between text-[11px] text-slate-500 gap-1">
        <div>
          {metadata.source && (
            <span>
              출처: <strong className="text-slate-700 dark:text-slate-300">{metadata.source}</strong>
            </span>
          )}
          {metadata.footnote && (
            <span className="block text-slate-400 italic mt-0.5">{metadata.footnote}</span>
          )}
        </div>
        <span className="text-[10px] font-mono text-slate-400 self-end">
          D3.js Visualization Engine
        </span>
      </div>
    </div>
  );
};
