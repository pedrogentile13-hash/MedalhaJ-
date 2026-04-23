'use client';

import { Olympiad } from '@/types';
import { getCutoffComparison, getCutoffMessage } from '@/utils/medals';

export function CutoffComparison({ olympiad }: { olympiad: Olympiad }) {
  const rows = getCutoffComparison(olympiad.hits, olympiad.cutoffs);

  if (rows.length === 0) {
    return (
      <p className="text-xs text-gray-600 italic">Nenhuma nota de corte registrada.</p>
    );
  }

  const classificationRow = rows.find((r) => r.isClassification);
  const medalRows = rows.filter((r) => !r.isClassification);

  return (
    <div className="space-y-3">
      {/* Classificação em destaque */}
      {classificationRow && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-1.5 font-semibold">
            Corte de Classificação
          </p>
          <div className={`flex items-center justify-between px-3 py-3 rounded-xl border ${classificationRow.colorBg} ${classificationRow.colorBorder}`}>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{classificationRow.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-white">
                  {classificationRow.status === 'above' ? '✅ Classificado!' : classificationRow.status === 'near' ? '⚠️ Quase lá' : '❌ Não classificado'}
                </p>
                <p className="text-[10px] text-gray-500">corte: {classificationRow.target} questões</p>
              </div>
            </div>
            <span className={`text-sm font-bold ${classificationRow.colorText}`}>
              {getCutoffMessage(classificationRow.diff, classificationRow.label, true)}
            </span>
          </div>
        </div>
      )}

      {/* Medalhas */}
      {medalRows.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-1.5 font-semibold">
            Notas de Corte — Medalhas
          </p>
          <div className="space-y-1.5">
            {medalRows.map((row) => (
              <div
                key={row.key}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border ${row.colorBg} ${row.colorBorder}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{row.emoji}</span>
                  <span className="text-xs text-gray-300">{row.label}</span>
                  <span className="text-[10px] text-gray-600">corte: {row.target}</span>
                </div>
                <span className={`text-xs font-medium ${row.colorText}`}>
                  {getCutoffMessage(row.diff, row.label)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
