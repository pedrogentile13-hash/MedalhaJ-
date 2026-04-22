'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
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
      <p className="text-xl font-bold text-white">{data.percentage}%</p>
      <p className={`text-xs ${config.text}`}>{config.emoji} {config.label}</p>
    </div>
  );
}

export function ComparisonBarChart({ olympiads }: { olympiads: Olympiad[] }) {
  if (olympiads.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
        Nenhum dado para exibir
      </div>
    );
  }

  const data = [...olympiads]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10)
    .map((o) => ({
      name: o.name.length > 10 ? o.name.slice(0, 10) + '…' : o.name,
      percentage: o.percentage,
      medal: o.medal,
    }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => {
            const config = getMedalConfig(entry.medal);
            return <Cell key={i} fill={config.color} fillOpacity={0.85} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
