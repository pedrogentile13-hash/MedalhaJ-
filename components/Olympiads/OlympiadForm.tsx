'use client';

import { useState } from 'react';
import { Olympiad, OlympiadFormData, OlympiadType, Cutoffs } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { calculateMedal, getMedalConfig, getTypeConfig } from '@/utils/medals';

interface OlympiadFormProps {
  initial?: Olympiad;
  onSubmit: (data: OlympiadFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const DEFAULT_CUTOFFS: Cutoffs = { classification: 0, honor: 0, bronze: 0, silver: 0, gold: 0 };

const TYPE_OPTIONS: { value: OlympiadType; label: string; emoji: string; desc: string }[] = [
  { value: 'olimpiada',      label: 'Olímpiada',      emoji: '🏆', desc: 'Valendo medalha' },
  { value: 'classificatoria',label: 'Classificatória',emoji: '📋', desc: 'Fase eliminatória' },
  { value: 'simulado',       label: 'Simulado',       emoji: '📝', desc: 'Treino / prática' },
];

export function OlympiadForm({ initial, onSubmit, onCancel, loading }: OlympiadFormProps) {
  const [type, setType]                   = useState<OlympiadType>(initial?.type || 'olimpiada');
  const [name, setName]                   = useState(initial?.name || '');
  const [subject, setSubject]             = useState(initial?.subject || '');
  const [hits, setHits]                   = useState(String(initial?.hits ?? ''));
  const [total, setTotal]                 = useState(String(initial?.total ?? ''));
  const [date, setDate]                   = useState(initial?.date || new Date().toISOString().slice(0, 10));
  const [notes, setNotes]                 = useState(initial?.notes || '');
  const [cutoffs, setCutoffs]             = useState<Cutoffs>(initial?.cutoffs || DEFAULT_CUTOFFS);
  const [errors, setErrors]               = useState<Record<string, string>>({});

  const hitsNum  = parseInt(hits)  || 0;
  const totalNum = parseInt(total) || 0;

  const previewMedal   = totalNum > 0 ? calculateMedal(hitsNum, cutoffs, type) : 'none';
  const previewConfig  = getMedalConfig(previewMedal);
  const previewPct     = totalNum > 0 ? Math.round((hitsNum / totalNum) * 1000) / 10 : 0;
  const previewClassified =
    type !== 'olimpiada' && cutoffs.classification > 0
      ? hitsNum >= cutoffs.classification
      : null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())                  e.name  = 'Nome obrigatório';
    if (!hits || isNaN(Number(hits)))  e.hits  = 'Número inválido';
    if (!total || isNaN(Number(total)))e.total = 'Número inválido';
    if (hitsNum > totalNum)            e.hits  = 'Acertos não podem exceder o total';
    if (!date)                         e.date  = 'Data obrigatória';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({ name: name.trim(), subject: subject.trim(), type, hits: hitsNum, total: totalNum, date, notes: notes.trim() || undefined, cutoffs });
  };

  const setCutoff = (key: keyof Cutoffs, value: string) =>
    setCutoffs((prev) => ({ ...prev, [key]: parseInt(value) || 0 }));

  const showMedalCutoffs       = type === 'olimpiada';
  const showClassificationCutoff = true; // sempre mostrar classificação

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Tipo — seletor em destaque */}
      <div>
        <p className="text-sm font-medium text-gray-300 mb-2">Tipo de atividade</p>
        <div className="grid grid-cols-3 gap-2">
          {TYPE_OPTIONS.map(({ value, label, emoji, desc }) => {
            const cfg = getTypeConfig(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-center transition-all ${
                  type === value
                    ? `${cfg.bg} ${cfg.border} ${cfg.text}`
                    : 'border-gray-700/50 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                <span className="text-xl">{emoji}</span>
                <span className="text-xs font-semibold">{label}</span>
                <span className="text-[9px] opacity-70">{desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview */}
      {totalNum > 0 && (
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${
          type === 'olimpiada'
            ? `bg-gradient-to-r ${previewConfig.bgGradient} ${previewConfig.border}`
            : type === 'classificatoria' && previewClassified !== null
              ? previewClassified
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-red-500/10 border-red-500/30'
              : 'bg-gray-800/40 border-gray-700/30'
        }`}>
          <span className="text-2xl">
            {type === 'olimpiada'
              ? previewConfig.emoji
              : type === 'classificatoria' && previewClassified !== null
                ? previewClassified ? '✅' : '❌'
                : getTypeConfig(type).emoji}
          </span>
          <div>
            <p className={`text-sm font-semibold ${
              type === 'olimpiada'
                ? previewConfig.text
                : previewClassified === true ? 'text-emerald-400' : previewClassified === false ? 'text-red-400' : 'text-gray-400'
            }`}>
              {type === 'olimpiada'
                ? previewConfig.label
                : type === 'classificatoria' && previewClassified !== null
                  ? previewClassified ? 'Classificado!' : 'Não classificado'
                  : getTypeConfig(type).label}
            </p>
            <p className="text-xs text-gray-400">{hitsNum}/{totalNum} = {previewPct}%</p>
          </div>
        </div>
      )}

      {/* Dados principais */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Input label="Nome *" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} placeholder="Ex: OBMEP 2025" />
        </div>
        <Input label="Matéria / Área" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex: Matemática" />
        <Input label="Data *" type="date" value={date} onChange={(e) => setDate(e.target.value)} error={errors.date} />
        <Input label="Acertos *" type="number" min={0} value={hits} onChange={(e) => setHits(e.target.value)} error={errors.hits} placeholder="0" />
        <Input label="Total de Questões *" type="number" min={1} value={total} onChange={(e) => setTotal(e.target.value)} error={errors.total} placeholder="0" />
      </div>

      {/* Notas de corte */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-300">Notas de Corte</p>

        {/* Classificação — sempre visível */}
        <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
          <p className="text-[10px] uppercase tracking-wider text-cyan-500/70 mb-2 font-semibold">📋 Corte de Classificação</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-300 flex-1">Mínimo para avançar / classificar</span>
            <input
              type="number" min={0}
              value={cutoffs.classification || ''}
              onChange={(e) => setCutoff('classification', e.target.value)}
              placeholder="0"
              className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white text-center focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Medalhas — apenas para olimpíada */}
        {showMedalCutoffs && (
          <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
            <p className="text-[10px] uppercase tracking-wider text-violet-500/70 mb-2 font-semibold">🏅 Cortes de Medalha</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { key: 'gold'   as keyof Cutoffs, label: '🥇 Ouro' },
                { key: 'silver' as keyof Cutoffs, label: '🥈 Prata' },
                { key: 'bronze' as keyof Cutoffs, label: '🥉 Bronze' },
                { key: 'honor'  as keyof Cutoffs, label: '🏅 Honra' },
              ] as const).map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2 bg-gray-800/40 border border-gray-700/60 rounded-xl px-3 py-2">
                  <span className="text-xs text-gray-400 flex-1">{label}</span>
                  <input
                    type="number" min={0}
                    value={cutoffs[key] || ''}
                    onChange={(e) => setCutoff(key, e.target.value)}
                    placeholder="0"
                    className="w-14 bg-transparent text-sm text-white text-right focus:outline-none placeholder-gray-600"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Textarea label="Observações" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Comentários sobre a prova..." rows={2} />

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" variant="primary" loading={loading} className="flex-1">
          {initial ? 'Salvar Alterações' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
}
