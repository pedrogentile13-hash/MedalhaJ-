'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, ChevronDown, ChevronUp, BookOpen, Calendar } from 'lucide-react';
import { Olympiad } from '@/types';
import { getMedalConfig } from '@/utils/medals';
import { formatDateShort } from '@/utils/formatting';
import { MedalBadge } from '@/components/ui/Badge';
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
  const config = getMedalConfig(olympiad.medal);
  const errors = olympiad.total - olympiad.hits;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`bg-gray-900/60 border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${config.border} hover:bg-gray-900/80`}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${config.bgGradient.replace('from-', 'from-').replace('to-transparent', 'to-' + config.border.replace('border-', ''))}`}
        style={{ background: `linear-gradient(to right, ${config.color}60, transparent)` }}
      />

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl leading-none mt-0.5 flex-shrink-0">{config.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-white truncate">{olympiad.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
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
              <MedalBadge medal={olympiad.medal} size="sm" />
            </div>

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
                <div className={`text-2xl font-bold tabular-nums ${config.text}`}>
                  {olympiad.percentage}%
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1 mt-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${olympiad.percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: delay + 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: config.color }}
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

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
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
