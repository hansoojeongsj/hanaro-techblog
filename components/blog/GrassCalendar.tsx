'use client';

import { useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type GrassData = {
  date: string;
  count: number;
  level: number;
};

interface GrassCalendarProps {
  data: GrassData[];
}

// 스타일 상수 (픽셀 단위)
const CELL_SIZE = 16;

export function GrassCalendar({ data }: GrassCalendarProps) {
  // 데이터 Map 변환
  const dataMap = useMemo(() => {
    const map = new Map<string, GrassData>();
    for (const item of data) {
      map.set(item.date, item);
    }
    return map;
  }, [data]);

  // 365일 데이터 생성 (오늘부터 과거로)
  const fullYearData = useMemo(() => {
    const result: GrassData[] = [];
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      // 순서 변경: 0(오늘) -> 364(과거)
      const date = new Date(today);
      date.setDate(today.getDate() - i); // 오늘부터 과거로

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
    // row-reverse를 쓸 것이므로 데이터는 [오늘, 어제, ..., 1년전] 순서여야 함
    // 하지만 Grid를 그릴 땐 주 단위로 묶어야 하므로 아래 로직에서 처리
    return result.reverse(); // [1년전, ..., 어제, 오늘] 순서로 다시 뒤집음 (계산 편의상)
  }, [dataMap]);

  // 주 단위 분리
  const weeks = useMemo(() => {
    const result: GrassData[][] = [];
    let currentWeek: GrassData[] = [];

    if (fullYearData.length > 0) {
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
    }

    return result;
  }, [fullYearData]);

  // 월 라벨 위치 계산
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

  // 🎨 [핵심] 렌더링을 위해 weeks 배열을 뒤집습니다.
  // CSS에서 flex-row-reverse를 쓸 것이기 때문에, 데이터는 [최근 주 ... 과거 주] 순서가 되어야 합니다.
  // const reversedWeeks = useMemo(() => [...weeks].reverse(), [weeks]);

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
    <div className="w-fit rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* 헤더 */}
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
        {/* 요일 라벨 */}
        <div className="flex flex-col gap-1 pt-6 font-medium text-[10px] text-muted-foreground leading-3">
          <span className="h-3"></span>
          <span className="flex h-3 items-center">월</span>
          <span className="h-3"></span>
          <span className="flex h-3 items-center">수</span>
          <span className="h-3"></span>
          <span className="flex h-3 items-center">금</span>
          <span className="h-3"></span>
        </div>

        {/* 잔디밭 스크롤 영역 */}
        {/* ✨ [핵심 변경] flex-row-reverse 적용 */}
        <div className="scrollbar-hide flex flex-1 flex-row-reverse overflow-x-auto pb-4">
          <div className="relative min-w-fit pr-1">
            {/* 월 라벨 */}
            <div className="relative mb-2 h-4 font-medium text-muted-foreground text-xs">
              {monthLabels.map(({ month, col }) => (
                <span
                  key={`${month}-${col}`}
                  className="absolute whitespace-nowrap"
                  // ✨ [핵심 변경] 위치 계산도 반대로 (전체 길이 - 현재 위치)
                  // 하지만 row-reverse 컨테이너 안에서는 '왼쪽'이 시각적 '오른쪽'이 될 수 있어
                  // 단순히 렌더링 순서만 바꾸는 게 낫습니다.
                  // 여기서는 reversedWeeks를 쓰므로 라벨 위치도 다시 계산해야 하지만,
                  // 쉬운 방법은 라벨도 그냥 절대 위치(`left`)로 박아두는 것입니다.
                  style={{ left: col * CELL_SIZE }}
                >
                  {month}
                </span>
              ))}
            </div>

            {/* 그리드 */}
            <TooltipProvider delayDuration={0}>
              <div className="flex gap-1 px-1">
                {/* weeks 데이터 그대로 사용하되, 스크롤 시작점만 오른쪽으로 바꿈 */}
                {weeks.map((week, weekIdx) => {
                  // reversedWeeks 대신 그냥 weeks 사용
                  const weekKey = week[0].date || `week-${weekIdx}`;
                  return (
                    <div key={weekKey} className="flex flex-col gap-1">
                      {week.map((day, dayIdx) => {
                        const dayKey = day.date || `${weekKey}-empty-${dayIdx}`;
                        return (
                          <Tooltip key={dayKey}>
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
                                <div className="mb-0.5 font-semibold">
                                  {day.count} contributions
                                </div>
                                <div className="text-muted-foreground">
                                  {formatDate(day.date)}
                                </div>
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
