'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { UserStats, MedalType } from '@/types';
import { MEDAL_CONFIG } from '@/utils/medals';

const ORDER: MedalType[] = ['gold', 'silver', 'bronze', 'honor'];

export function MedalPieChart({ stats }: { stats: UserStats }) {
  const data = ORDER.filter((m) => stats.medals[m] > 0).map((m) => ({
    name: MEDAL_CONFIG[m].label,
    value: stats.medals[m],
    color: MEDAL_CONFIG[m].color,
    emoji: MEDAL_CONFIG[m].emoji,
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
        Sem medalhas ainda
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={50}
          outerRadius={75}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#111827',
            border: '1px solid #374151',
            borderRadius: '12px',
            color: '#f9fafb',
            fontSize: '12px',
          }}
          formatter={(value: number, name: string) => [value, name]}
        />
        <Legend
          iconSize={8}
          iconType="circle"
          formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 11 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
