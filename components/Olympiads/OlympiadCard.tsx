'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, ChevronDown, ChevronUp, BookOpen, Calendar } from 'lucide-react';
import { Olympiad } from '@/types';
import { getMedalConfig, getTypeConfig } from '@/utils/medals';
import { formatDateShort } from '@/utils/formatting';
import { Button } from '@/components/ui/Button';
import { CutoffComparison } from './CutoffComparison';

interface OlympiadCardProps {
  olympiad: Olympiad;
  onEdit: (o: Olympiad) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

export function OlympiadCard({ olympiad, onEdit, onDelete, delay = 0 }: OlympiadCardProps) {
  const [expanded, setExpanded] = useState(false);

  const type    = olympiad.type ?? 'olimpiada';
  const typeCfg = getTypeConfig(type);
  const medalCfg = getMedalConfig(olympiad.medal);
  const errors = olympiad.total - olympiad.hits;

  // Cor da borda e do card depende do tipo
  const borderClass =
    type === 'olimpiada'
      ? medalCfg.border
      : type === 'classificatoria'
      ? olympiad.classified === true
        ? 'border-emerald-500/30'
        : olympiad.classified === false
        ? 'border-red-500/20'
        : 'border-cyan-500/20'
      : 'border-blue-500/15';

  const accentColor =
    type === 'olimpiada'
      ? medalCfg.color
      : type === 'classificatoria'
      ? olympiad.classified === true
        ? '#10b981'
        : olympiad.classified === false
        ? '#ef4444'
        : '#06b6d4'
      : '#3b82f6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`bg-gray-900/60 border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-gray-900/80 ${borderClass}`}
    >
      {/* Barra de cor no topo */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${accentColor}70, transparent)` }} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Ícone principal */}
          <div className="text-3xl leading-none mt-0.5 flex-shrink-0">
            {type === 'olimpiada'
              ? medalCfg.emoji
              : type === 'classificatoria' && olympiad.classified !== undefined
              ? olympiad.classified ? '✅' : '❌'
              : typeCfg.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-white truncate">{olympiad.name}</h3>
                <div className="flex items-center flex-wrap gap-2 mt-0.5">
                  {/* Badge do tipo */}
                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${typeCfg.bg} ${typeCfg.border} ${typeCfg.text}`}>
                    {typeCfg.emoji} {typeCfg.label}
                  </span>
                  {olympiad.subject && (
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <BookOpen className="w-2.5 h-2.5" />
                      {olympiad.subject}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-600 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    {formatDateShort(olympiad.date)}
                  </span>
                </div>
              </div>

              {/* Badge de resultado */}
              {type === 'olimpiada' ? (
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border bg-gradient-to-r ${medalCfg.bgGradient} ${medalCfg.border} ${medalCfg.text} flex-shrink-0`}>
                  {medalCfg.emoji} {medalCfg.label}
                </span>
              ) : type === 'classificatoria' && olympiad.classified !== undefined ? (
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${
                  olympiad.classified
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {olympiad.classified ? '✅ Classificado' : '❌ Não classificado'}
                </span>
              ) : (
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${typeCfg.bg} ${typeCfg.border} ${typeCfg.text} flex-shrink-0`}>
                  {typeCfg.emoji} {typeCfg.label}
                </span>
              )}
            </div>

            {/* Barra de desempenho */}
            <div className="flex items-center gap-4 mt-3">
              <div className="text-center">
                <div className="text-xl font-bold text-white tabular-nums">{olympiad.hits}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wider">Acertos</div>
              </div>
              <div className="text-gray-700">/</div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-400 tabular-nums">{olympiad.total}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wider">Total</div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold tabular-nums" style={{ color: accentColor }}>
                  {olympiad.percentage}%
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1 mt-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${olympiad.percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: delay + 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: accentColor }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-red-400 tabular-nums">{errors}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wider">Erros</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/60">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? 'Menos detalhes' : 'Ver notas de corte'}
          </button>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(olympiad)} className="h-7 px-2">
              <Pencil className="w-3 h-3" />
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(olympiad.id)} className="h-7 px-2">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Detalhes expandidos */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 pt-3 border-t border-gray-800/60"
          >
            <CutoffComparison olympiad={olympiad} />
            {olympiad.notes && (
              <div className="mt-3 p-2.5 rounded-xl bg-gray-800/40">
                <p className="text-[10px] text-gray-500 mb-1">Observações</p>
                <p className="text-xs text-gray-300">{olympiad.notes}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
