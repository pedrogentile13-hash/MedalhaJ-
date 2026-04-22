'use client';

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { Olympiad } from '@/types';

function buildRadarData(olympiads: Olympiad[]) {
  const subjectMap: Record<string, number[]> = {};
  olympiads.forEach((o) => {
    const key = o.subject || 'Geral';
    if (!subjectMap[key]) subjectMap[key] = [];
    subjectMap[key].push(o.percentage);
  });

  if (Object.keys(subjectMap).length < 3) {
    return [
      { subject: 'Desempenho', value: olympiads.reduce((a, b) => a + b.percentage, 0) / (olympiads.length || 1) },
      { subject: 'Consistência', value: olympiads.length > 1 ? 100 - (Math.max(...olympiads.map(o => o.percentage)) - Math.min(...olympiads.map(o => o.percentage))) : 50 },
      { subject: 'Medalhas', value: (olympiads.filter(o => o.medal !== 'none').length / (olympiads.length || 1)) * 100 },
      { subject: 'Evolução', value: olympiads.length >= 2 ? (olympiads[olympiads.length - 1]?.percentage ?? 0) : 50 },
      { subject: 'Volume', value: Math.min(100, (olympiads.length / 10) * 100) },
    ];
  }

  return Object.entries(subjectMap).map(([subject, scores]) => ({
    subject: subject.length > 10 ? subject.slice(0, 10) + '…' : subject,
    value: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }));
}

export function RadarPerformance({ olympiads }: { olympiads: Olympiad[] }) {
  if (olympiads.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
        Nenhum dado para exibir
      </div>
    );
  }

  const data = buildRadarData(olympiads);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="#1f2937" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#9ca3af', fontSize: 10 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#111827',
            border: '1px solid #374151',
            borderRadius: '12px',
            color: '#f9fafb',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`${value}%`, 'Desempenho']}
        />
        <Radar
          name="Desempenho"
          dataKey="value"
          stroke="#7c3aed"
          fill="#7c3aed"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
