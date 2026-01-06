'use client';

import { useMemo } from 'react';
import type { GrassData } from '@/app/(blog)/blog.service';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDate } from '@/lib/utils';

type GrassCalendarProps = {
  data: GrassData[];
};

const CELL_SIZE = 16;

export function GrassCalendar({ data }: GrassCalendarProps) {
  const dataMap = useMemo(() => {
    const map = new Map<string, GrassData>();
    for (const item of data) {
      map.set(item.date, item);
    }
    return map;
  }, [data]);

  const fullYearData = useMemo(() => {
    const result: GrassData[] = [];
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;

      result.push(
        dataMap.get(key) ?? {
          date: key,
          count: 0,
          level: 0,
          createdCount: 0,
          updatedCount: 0,
        },
      );
    }
    return result.reverse();
  }, [dataMap]);

  const weeks = useMemo(() => {
    const result: GrassData[][] = [];
    let currentWeek: GrassData[] = [];

    if (fullYearData.length > 0) {
      const firstDate = new Date(fullYearData[0].date);
      const firstDayOfWeek = firstDate.getDay();

      for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek.push({
          date: '',
          count: 0,
          level: 0,
          createdCount: 0,
          updatedCount: 0,
        });
      }

      for (const day of fullYearData) {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
          result.push(currentWeek);
          currentWeek = [];
        }
      }

      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
          currentWeek.push({
            date: '',
            count: 0,
            level: 0,
            createdCount: 0,
            updatedCount: 0,
          });
        }
        result.push(currentWeek);
      }
    }
    return result;
  }, [fullYearData]);

  const monthLabels = useMemo(() => {
    const labels: { month: string; col: number }[] = [];
    let lastMonth = '';

    weeks.forEach((week, col) => {
      const validDay = week.find((d) => d.date);
      if (!validDay) return;

      const month = new Date(validDay.date).toLocaleString('ko-KR', {
        month: 'short',
      });
      if (month !== lastMonth) {
        labels.push({ month, col });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  const getGrassClass = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-grass-1';
      case 2:
        return 'bg-grass-2';
      case 3:
        return 'bg-grass-3';
      case 4:
        return 'bg-grass-4';
      default:
        return 'bg-muted/80';
    }
  };

  return (
    <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-lg">활동 기록</h3>
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-3 w-3 rounded-sm ${getGrassClass(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-1 pt-6 font-medium text-[10px] text-muted-foreground leading-3">
          <span className="h-3"></span>
          <span className="flex h-3 items-center">월</span>
          <span className="h-3"></span>
          <span className="flex h-3 items-center">수</span>
          <span className="h-3"></span>
          <span className="flex h-3 items-center">금</span>
          <span className="h-3"></span>
        </div>

        <div className="scrollbar-hide flex flex-1 flex-row-reverse overflow-x-auto pb-4">
          <div className="relative min-w-fit pr-1">
            <div className="relative mb-2 h-4 font-medium text-muted-foreground text-xs">
              {monthLabels.map(({ month, col }) => (
                <span
                  key={`${month}-${col}`}
                  className="absolute whitespace-nowrap"
                  style={{ left: col * CELL_SIZE }}
                >
                  {month}
                </span>
              ))}
            </div>

            <TooltipProvider delayDuration={0}>
              <div className="flex gap-1 px-1">
                {weeks.map((week) => (
                  <div
                    key={week.find((d) => d.date)?.date || Math.random()}
                    className="flex flex-col gap-1"
                  >
                    {week.map((day) => (
                      <Tooltip key={day.date || Math.random()}>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-3 w-3 rounded-sm transition-all duration-200 ${
                              day.date
                                ? `${getGrassClass(day.level)} cursor-pointer hover:ring-2 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background`
                                : 'opacity-0'
                            }`}
                          />
                        </TooltipTrigger>
                        {day.date && (
                          <TooltipContent side="top" className="text-xs">
                            <div className="mb-1 border-b pb-1 font-semibold">
                              {formatDate(new Date(day.date))}
                            </div>
                            <div className="space-y-1">
                              <StatRow
                                label="새 글 작성"
                                value={day.createdCount}
                              />
                              <StatRow
                                label="글 수정"
                                value={day.updatedCount}
                              />
                              <div className="mt-1 flex items-center justify-between border-t pt-1 font-bold">
                                <span>총 활동</span>
                                <span>{day.count}</span>
                              </div>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatRow = ({ label, value }: { label: string; value?: number }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-muted">{label}</span>
    <span className="font-medium text-primary">{value || 0}</span>
  </div>
);
