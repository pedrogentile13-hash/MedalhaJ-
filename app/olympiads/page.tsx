'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { OlympiadCard } from '@/components/Olympiads/OlympiadCard';
import { OlympiadForm } from '@/components/Olympiads/OlympiadForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { Olympiad, OlympiadFormData, MedalType } from '@/types';
import toast from 'react-hot-toast';
import { saveOlympiad, deleteOlympiadFromDB, isFirebaseConfigured } from '@/services/firebase';

type SortKey = 'date' | 'name' | 'percentage' | 'medal';
type FilterMedal = MedalType | 'all';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'date', label: 'Data' },
  { key: 'percentage', label: 'Porcentagem' },
  { key: 'name', label: 'Nome' },
  { key: 'medal', label: 'Medalha' },
];

const MEDAL_ORDER: Record<MedalType, number> = { gold: 0, silver: 1, bronze: 2, honor: 3, none: 4 };

export default function OlympiadsPage() {
  const { olympiads, addOlympiad, updateOlympiad, deleteOlympiad, user } = useStore((s) => ({
    olympiads: s.olympiads,
    addOlympiad: s.addOlympiad,
    updateOlympiad: s.updateOlympiad,
    deleteOlympiad: s.deleteOlympiad,
    user: s.user,
  }));

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Olympiad | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterMedal, setFilterMedal] = useState<FilterMedal>('all');
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    let list = [...olympiads];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((o) => o.name.toLowerCase().includes(q) || o.subject?.toLowerCase().includes(q));
    }
    if (filterMedal !== 'all') {
      list = list.filter((o) => o.medal === filterMedal);
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      else if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'percentage') cmp = a.percentage - b.percentage;
      else if (sortKey === 'medal') cmp = MEDAL_ORDER[a.medal] - MEDAL_ORDER[b.medal];
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [olympiads, search, sortKey, sortAsc, filterMedal]);

  const handleAdd = async (data: OlympiadFormData) => {
    setSaving(true);
    try {
      const created = addOlympiad(data);
      if (isFirebaseConfigured() && user) {
        await saveOlympiad({ ...created, userId: user.uid });
      }
      toast.success('Olimpíada adicionada! 🏆');
      setShowAdd(false);
    } catch (err) {
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data: OlympiadFormData) => {
    if (!editTarget) return;
    setSaving(true);
    try {
      updateOlympiad(editTarget.id, data);
      if (isFirebaseConfigured() && user) {
        const updated = olympiads.find((o) => o.id === editTarget.id);
        if (updated) await saveOlympiad({ ...updated, ...data, userId: user.uid });
      }
      toast.success('Olimpíada atualizada!');
      setEditTarget(null);
    } catch (err) {
      toast.error('Erro ao atualizar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const o = olympiads.find((x) => x.id === id);
    if (!o) return;
    if (!window.confirm(`Excluir "${o.name}"?`)) return;
    deleteOlympiad(id);
    if (isFirebaseConfigured() && user) {
      await deleteOlympiadFromDB(id).catch(() => {});
    }
    toast.success('Olimpíada excluída.');
  };

  return (
    <AppLayout title="Olimpíadas">
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar olimpíadas..."
              className="w-full bg-gray-800/60 border border-gray-700/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>
          <Button variant="primary" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap gap-2 items-center">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
          {(['all', 'gold', 'silver', 'bronze', 'honor', 'none'] as FilterMedal[]).map((m) => (
            <button
              key={m}
              onClick={() => setFilterMedal(m)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                filterMedal === m
                  ? 'bg-violet-600/20 border-violet-500/50 text-violet-300'
                  : 'bg-transparent border-gray-700/60 text-gray-500 hover:text-gray-300'
              }`}
            >
              {m === 'all' ? 'Todas' : m === 'gold' ? '🥇 Ouro' : m === 'silver' ? '🥈 Prata' : m === 'bronze' ? '🥉 Bronze' : m === 'honor' ? '🏅 Honra' : '📜 Participação'}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-600">Ordenar:</span>
          {SORT_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { if (sortKey === key) setSortAsc(!sortAsc); else { setSortKey(key); setSortAsc(false); } }}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                sortKey === key
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-transparent border-gray-700/60 text-gray-600 hover:text-gray-400'
              }`}
            >
              {label} {sortKey === key && (sortAsc ? '↑' : '↓')}
            </button>
          ))}
        </div>

        {/* Count */}
        {olympiads.length > 0 && (
          <p className="text-xs text-gray-600">
            {filtered.length} de {olympiads.length} olimpíada{olympiads.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-5xl">🏆</span>
            <p className="text-gray-400 text-sm">
              {olympiads.length === 0
                ? 'Nenhuma olimpíada registrada ainda.'
                : 'Nenhuma olimpíada encontrada com esses filtros.'}
            </p>
            {olympiads.length === 0 && (
              <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
                <Plus className="w-3.5 h-3.5" />
                Adicionar primeira olimpíada
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((o, i) => (
              <OlympiadCard
                key={o.id}
                olympiad={o}
                onEdit={setEditTarget}
                onDelete={handleDelete}
                delay={i * 0.04}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nova Olimpíada" maxWidth="max-w-xl">
        <OlympiadForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} loading={saving} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Editar Olimpíada" maxWidth="max-w-xl">
        {editTarget && (
          <OlympiadForm
            initial={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
            loading={saving}
          />
        )}
      </Modal>
    </AppLayout>
  );
}
