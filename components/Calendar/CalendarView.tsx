'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isSameMonth, isToday, parseISO, startOfWeek, endOfWeek,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from '@/types';
import { Button } from '@/components/ui/Button';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (date: string) => void;
  onDeleteEvent: (id: string) => void;
}

export function CalendarView({ events, onAddEvent, onDeleteEvent }: CalendarViewProps) {
  const [current, setCurrent] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getEventsForDay = (day: Date) =>
    events.filter((e) => isSameDay(parseISO(e.date), day));

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const prev = () => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1));
  const next = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white capitalize">
          {format(current, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrent(new Date())}
            className="px-2.5 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Hoje
          </button>
          <button
            onClick={next}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-gray-600 py-1 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const inMonth = isSameMonth(day, current);
          const today = isToday(day);
          const selected = selectedDay && isSameDay(day, selectedDay);

          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDay(isSameDay(day, selectedDay!) ? null : day)}
              className={`
                relative min-h-[52px] p-1.5 rounded-xl flex flex-col items-center gap-1 transition-all text-sm
                ${!inMonth ? 'opacity-30' : ''}
                ${today ? 'bg-violet-600/20 border border-violet-500/50' : 'hover:bg-gray-800/60'}
                ${selected ? 'ring-2 ring-violet-400' : ''}
              `}
            >
              <span className={`text-xs font-medium ${today ? 'text-violet-300' : inMonth ? 'text-gray-300' : 'text-gray-600'}`}>
                {format(day, 'd')}
              </span>
              <div className="flex flex-wrap gap-0.5 justify-center">
                {dayEvents.slice(0, 3).map((e, j) => (
                  <div
                    key={j}
                    className="w-1.5 h-1.5 rounded-full bg-violet-400"
                    title={e.name}
                  />
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected day events */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white capitalize">
                {format(selectedDay, "d 'de' MMMM", { locale: ptBR })}
              </h3>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onAddEvent(format(selectedDay, 'yyyy-MM-dd'))}
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </Button>
            </div>

            {selectedEvents.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-3">
                Nenhum evento. Clique em &quot;Adicionar&quot; para criar um.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-gray-800/40 border border-gray-700/40"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-white font-medium">{event.name}</p>
                        {event.description && (
                          <p className="text-xs text-gray-500">{event.description}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteEvent(event.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
