'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts';
import { Olympiad } from '@/types';
import { getMedalConfig } from '@/utils/medals';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.[0]) return null;
  const data = payload[0].payload;
  const config = getMedalConfig(data.medal);
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-lg font-bold text-white">{data.percentage}%</p>
      <p className="text-xs">{config.emoji} {config.label}</p>
      <p className="text-xs text-gray-500">{data.hits}/{data.total} acertos</p>
    </div>
  );
}

export function PerformanceLineChart({ olympiads }: { olympiads: Olympiad[] }) {
  if (olympiads.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
        Nenhum dado para exibir
      </div>
    );
  }

  const data = [...olympiads]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((o) => ({
      name: o.name.length > 12 ? o.name.slice(0, 12) + '…' : o.name,
      percentage: o.percentage,
      medal: o.medal,
      hits: o.hits,
      total: o.total,
    }));

  const avg = data.reduce((s, d) => s + d.percentage, 0) / data.length;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#6b7280', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#6b7280', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={avg}
          stroke="#3b82f6"
          strokeDasharray="4 2"
          label={{ value: `Média ${avg.toFixed(1)}%`, fill: '#3b82f6', fontSize: 10, position: 'right' }}
        />
        <Area
          type="monotone"
          dataKey="percentage"
          stroke="#7c3aed"
          strokeWidth={2.5}
          fill="url(#perfGradient)"
          dot={(props: any) => {
            const { cx, cy, payload } = props;
            const config = getMedalConfig(payload.medal);
            return (
              <circle
                key={`dot-${payload.name}`}
                cx={cx} cy={cy} r={5}
                fill={config.color}
                stroke="#0f0f11"
                strokeWidth={2}
              />
            );
          }}
          activeDot={{ r: 7, fill: '#7c3aed', stroke: '#0f0f11', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
