'use client';

import { useState, useEffect } from 'react';
import { Olympiad, OlympiadFormData, Cutoffs } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { calculateMedal, getMedalConfig } from '@/utils/medals';

interface OlympiadFormProps {
  initial?: Olympiad;
  onSubmit: (data: OlympiadFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const DEFAULT_CUTOFFS: Cutoffs = {
  classification: 0,
  honor: 0,
  bronze: 0,
  silver: 0,
  gold: 0,
};

export function OlympiadForm({ initial, onSubmit, onCancel, loading }: OlympiadFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [subject, setSubject] = useState(initial?.subject || '');
  const [hits, setHits] = useState(String(initial?.hits ?? ''));
  const [total, setTotal] = useState(String(initial?.total ?? ''));
  const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState(initial?.notes || '');
  const [cutoffs, setCutoffs] = useState<Cutoffs>(initial?.cutoffs || DEFAULT_CUTOFFS);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const hitsNum = parseInt(hits) || 0;
  const totalNum = parseInt(total) || 0;
  const previewMedal = totalNum > 0 ? calculateMedal(hitsNum, cutoffs) : 'none';
  const previewConfig = getMedalConfig(previewMedal);
  const previewPct = totalNum > 0 ? Math.round((hitsNum / totalNum) * 1000) / 10 : 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nome obrigatório';
    if (!hits || isNaN(Number(hits))) e.hits = 'Número inválido';
    if (!total || isNaN(Number(total))) e.total = 'Número inválido';
    if (hitsNum > totalNum) e.hits = 'Acertos não podem exceder o total';
    if (!date) e.date = 'Data obrigatória';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({
      name: name.trim(),
      subject: subject.trim(),
      hits: hitsNum,
      total: totalNum,
      date,
      notes: notes.trim() || undefined,
      cutoffs,
    });
  };

  const setCutoff = (key: keyof Cutoffs, value: string) => {
    setCutoffs((prev) => ({ ...prev, [key]: parseInt(value) || 0 }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Preview */}
      {totalNum > 0 && (
        <div className={`flex items-center gap-3 p-3 rounded-xl border bg-gradient-to-r ${previewConfig.bgGradient} ${previewConfig.border}`}>
          <span className="text-2xl">{previewConfig.emoji}</span>
          <div>
            <p className={`text-sm font-semibold ${previewConfig.text}`}>{previewConfig.label}</p>
            <p className="text-xs text-gray-400">{hitsNum}/{totalNum} = {previewPct}%</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Input
            label="Nome da Olimpíada *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="Ex: OBMEP 2025"
          />
        </div>
        <Input
          label="Matéria / Área"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ex: Matemática"
        />
        <Input
          label="Data da Prova *"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />
        <Input
          label="Acertos *"
          type="number"
          min={0}
          value={hits}
          onChange={(e) => setHits(e.target.value)}
          error={errors.hits}
          placeholder="0"
        />
        <Input
          label="Total de Questões *"
          type="number"
          min={1}
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          error={errors.total}
          placeholder="0"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-300 mb-2">Notas de Corte (opcional)</p>
        <div className="grid grid-cols-2 gap-2">
          {([
            { key: 'gold' as keyof Cutoffs, label: '🥇 Ouro' },
            { key: 'silver' as keyof Cutoffs, label: '🥈 Prata' },
            { key: 'bronze' as keyof Cutoffs, label: '🥉 Bronze' },
            { key: 'honor' as keyof Cutoffs, label: '🏅 Honra' },
          ] as const).map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2 bg-gray-800/40 border border-gray-700/60 rounded-xl px-3 py-2">
              <span className="text-sm flex-shrink-0 w-16 text-gray-400">{label}</span>
              <input
                type="number"
                min={0}
                value={cutoffs[key] || ''}
                onChange={(e) => setCutoff(key, e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none w-12"
              />
            </div>
          ))}
        </div>
      </div>

      <Textarea
        label="Observações"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Comentários sobre a prova..."
        rows={2}
      />

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading} className="flex-1">
          {initial ? 'Salvar Alterações' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
}
