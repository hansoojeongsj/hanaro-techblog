import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';

  const parts = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  }).formatToParts(d);

  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;

  return `${year}/${month}/${day}`;
};

export const formatFullDate = (date: Date | string | number): string => {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return '-';

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

export const categoryIcons: Record<string, string> = {
  javascript: '🟨',
  typescript: '🔷',
  react: '⚛️',
  nextjs: '▲',
  css: '🎨',
  git: '🔀',
};
