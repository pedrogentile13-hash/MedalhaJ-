'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

interface EventFormProps {
  initialDate?: string;
  onSubmit: (data: { name: string; date: string; description?: string }) => void;
  onCancel: () => void;
}

export function EventForm({ initialDate, onSubmit, onCancel }: EventFormProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(initialDate || new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Nome obrigatório'); return; }
    if (!date) { setError('Data obrigatória'); return; }
    onSubmit({ name: name.trim(), date, description: description.trim() || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome do Evento *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex: OBMEP – Fase 2"
        error={error && !name ? error : ''}
        autoFocus
      />
      <Input
        label="Data *"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Textarea
        label="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Detalhes do evento..."
        rows={2}
      />
      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          Adicionar
        </Button>
      </div>
    </form>
  );
}
