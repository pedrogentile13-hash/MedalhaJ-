'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock } from 'lucide-react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { CalendarView } from '@/components/Calendar/CalendarView';
import { EventForm } from '@/components/Calendar/EventForm';
import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/store/useStore';
import { formatDate } from '@/utils/formatting';
import { parseISO, isAfter, startOfDay } from 'date-fns';
import toast from 'react-hot-toast';

export default function CalendarPage() {
  const { events, addEvent, deleteEvent } = useStore((s) => ({
    events: s.events,
    addEvent: s.addEvent,
    deleteEvent: s.deleteEvent,
  }));

  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const upcoming = events
    .filter((e) => isAfter(parseISO(e.date), startOfDay(new Date())))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 5);

  const handleAddEvent = (date: string) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleSubmit = (data: { name: string; date: string; description?: string }) => {
    addEvent(data);
    toast.success('Evento adicionado! 📅');
    setShowForm(false);
    setSelectedDate(undefined);
  };

  return (
    <AppLayout title="Calendário">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5">
          <CalendarView
            events={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={(id) => {
              deleteEvent(id);
              toast.success('Evento removido.');
            }}
          />
        </div>

        {/* Upcoming events */}
        <div className="space-y-4">
          <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-white">Próximas Provas</h3>
            </div>

            {upcoming.length === 0 ? (
              <div className="text-center py-6">
                <Clock className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Nenhum evento futuro</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((event, i) => {
                  const daysLeft = Math.ceil(
                    (parseISO(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/30"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-3.5 h-3.5 text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{event.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(event.date)}</p>
                        {event.description && (
                          <p className="text-xs text-gray-600 mt-0.5 truncate">{event.description}</p>
                        )}
                      </div>
                      <span className={`text-xs font-medium flex-shrink-0 px-2 py-0.5 rounded-full ${
                        daysLeft <= 3
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : daysLeft <= 7
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {daysLeft}d
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* All events count */}
          <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Total de eventos</span>
              <span className="text-lg font-bold text-white">{events.length}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-400">Futuros</span>
              <span className="text-sm font-medium text-violet-400">{upcoming.length}</span>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setSelectedDate(undefined); }}
        title="Novo Evento"
      >
        <EventForm
          initialDate={selectedDate}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setSelectedDate(undefined); }}
        />
      </Modal>
    </AppLayout>
  );
}
