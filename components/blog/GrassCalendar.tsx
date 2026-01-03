'use client';

import { useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type GrassData = {
  date: string; // YYYY-MM-DD
  count: number;
  level: number; // 0 ~ 4
};

interface GrassCalendarProps {
  data: GrassData[];
}

export function GrassCalendar({ data }: GrassCalendarProps) {
  // 날짜 → 데이터 Map
  const dataMap = useMemo(() => {
    const map = new Map<string, GrassData>();
    for (const item of data) {
      map.set(item.date, item);
    }
    return map;
  }, [data]);

  // 오늘 기준 최근 365일 (빈 날 포함)
  const fullYearData = useMemo(() => {
    const result: GrassData[] = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
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
        },
      );
    }

    return result;
  }, [dataMap]);

  // 3️⃣ 주 단위 분리
  const weeks = useMemo(() => {
    const result: GrassData[][] = [];
    let currentWeek: GrassData[] = [];

    const firstDate = new Date(fullYearData[0].date);
    const firstDayOfWeek = firstDate.getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: '', count: 0, level: 0 });
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
        currentWeek.push({ date: '', count: 0, level: 0 });
      }
      result.push(currentWeek);
    }

    return result;
  }, [fullYearData]);

  // 4️⃣ 월 라벨
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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="w-full rounded-xl border border-border bg-card p-6">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
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
        {/* 요일 */}
        <div className="flex flex-col gap-1 pt-6 text-muted-foreground text-xs">
          <span className="h-2" />
          <span className="h-3">월</span>
          <span className="h-3" />
          <span className="h-3">수</span>
          <span className="h-3" />
          <span className="h-3">금</span>
          <span className="h-2" />
        </div>

        {/* 잔디 */}
        <div className="flex-1 overflow-x-auto pb-2">
          <div className="relative min-w-fit">
            {/* 월 */}
            <div className="relative mb-1 h-4 text-muted-foreground text-xs">
              {monthLabels.map(({ month, col }) => (
                <span
                  key={`${month}-${col}`}
                  className="absolute"
                  style={{ left: col * 16 }}
                >
                  {month}
                </span>
              ))}
            </div>

            {/* 그리드 */}
            <TooltipProvider delayDuration={100}>
              <div className="flex gap-1">
                {weeks.map((week) => {
                  const weekKey =
                    week.find((d) => d.date)?.date ?? crypto.randomUUID();

                  return (
                    <div key={weekKey} className="flex flex-col gap-1">
                      {week.map((day, idx) => {
                        const dayKey = day.date || `${weekKey}-empty-${idx}`;

                        return (
                          <Tooltip key={dayKey}>
                            <TooltipTrigger asChild>
                              <div
                                className={`h-3 w-3 rounded-sm transition ${
                                  day.date
                                    ? `${getGrassClass(
                                        day.level,
                                      )} hover:ring-2 hover:ring-ring hover:ring-offset-1`
                                    : 'bg-transparent'
                                }
                                `}
                              />
                            </TooltipTrigger>

                            {day.date && (
                              <TooltipContent side="top">
                                <p className="font-medium text-sm">
                                  {day.count} contributions
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {formatDate(day.date)}
                                </p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
