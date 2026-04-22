import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy');
  } catch {
    return dateStr;
  }
}

export function formatRelativeDate(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: ptBR });
  } catch {
    return dateStr;
  }
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatScore(hits: number, total: number): string {
  return `${hits}/${total}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
