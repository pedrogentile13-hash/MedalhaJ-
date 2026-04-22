'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Edit2, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function GoalProgress() {
  const { goal, setGoal, getStats } = useStore((s) => ({
    goal: s.goal,
    setGoal: s.setGoal,
    getStats: s.getStats,
  }));
  const stats = getStats();
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(goal));

  const totalMedals = stats.totalMedals;
  const percentage = Math.min(100, (totalMedals / goal) * 100);

  const messages = [
    { threshold: 0, text: 'Vamos começar! 🚀', color: 'text-gray-400' },
    { threshold: 25, text: 'Bom começo, continue! 💪', color: 'text-blue-400' },
    { threshold: 50, text: 'Metade do caminho! ⚡', color: 'text-yellow-400' },
    { threshold: 75, text: 'Quase lá, atleta! 🔥', color: 'text-orange-400' },
    { threshold: 100, text: 'Meta atingida! Parabéns! 🏆', color: 'text-emerald-400' },
  ];
  const msg = [...messages].reverse().find((m) => percentage >= m.threshold) || messages[0];

  const handleSave = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val) && val > 0) setGoal(val);
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Meta de Medalhas</h3>
        </div>
        <button
          onClick={() => { setEditing(!editing); setInputValue(String(goal)); }}
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {editing ? (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            min={1}
            max={100}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button
            onClick={handleSave}
            className="p-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-bold text-white tabular-nums">{totalMedals}</span>
          <span className="text-gray-500 mb-1 text-sm">/ {goal} medalhas</span>
        </div>
      )}

      <ProgressBar
        value={totalMedals}
        max={goal}
        color={percentage >= 100 ? 'gold' : 'gradient'}
        animated
      />

      <p className={`text-xs mt-2 font-medium ${msg.color}`}>{msg.text}</p>

      {percentage < 100 && (
        <p className="text-[11px] text-gray-600 mt-1">
          Faltam {goal - totalMedals} medalha{goal - totalMedals !== 1 ? 's' : ''} para atingir a meta
        </p>
      )}
    </motion.div>
  );
}
