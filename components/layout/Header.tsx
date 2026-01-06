'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './ModeToggle';
import { ProfileToggle } from './ProfileToggle';

type HeaderProps = {
  isLoggedIn?: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'ADMIN' | 'USER';
  };
};

export default function Header({ isLoggedIn = false, user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/categories', label: '카테고리' },
    { href: '/posts', label: '전체 글' },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="relative flex h-16 items-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold font-mono text-primary text-xl"
          >
            <span className="text-2xl">&lt;/&gt;</span>
            <span className="hidden lg:inline">Hanaro TechBlog</span>
          </Link>

          <nav className="-translate-x-1/2 absolute left-1/2 hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                  pathname === href
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />
            <ProfileToggle isLoggedIn={isLoggedIn} user={user} />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="flex flex-col gap-2 border-t py-4 md:hidden">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-2 font-medium text-sm ${
                  pathname === href
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
