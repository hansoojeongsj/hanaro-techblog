'use client';

import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AdminTableShellProps = {
  children: React.ReactNode;
  searchPlaceholder: string;
  searchParamKey: string;
  pageParamKey: string;
  currentPage: number;
  totalPages: number;
  extraActions?: React.ReactNode;
};

export function AdminTableShell({
  children,
  searchPlaceholder,
  searchParamKey,
  pageParamKey,
  currentPage,
  totalPages,
  extraActions,
}: AdminTableShellProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const debouncedSearch = useMemo(() => {
    let timer: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        value
          ? params.set(searchParamKey, value)
          : params.delete(searchParamKey);
        params.set(pageParamKey, '1');
        router.push(`/admin?${params.toString()}`);
      }, 500);
    };
  }, [router, searchParamKey, pageParamKey]);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set(pageParamKey, page.toString());
    router.push(`/admin?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder={searchPlaceholder}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              debouncedSearch(e.target.value);
            }}
            className="pl-10"
          />
        </div>
        {extraActions}
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        {children}
      </div>

      <div className="flex items-center justify-center gap-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium text-sm">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
