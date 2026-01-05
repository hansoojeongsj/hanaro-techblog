'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ModeToggle } from './ModeToggle';
import { ProfileToggle } from './ProfileToggle';

interface HeaderProps {
  isLoggedIn?: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'ADMIN' | 'USER';
  };
}

export default function Header({ isLoggedIn = false, user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/categories', label: '카테고리' },
    { href: '/posts', label: '전체 글' },
  ] as const;

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-border border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="relative flex h-16 items-center">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold font-mono text-primary text-xl"
          >
            <span className="text-2xl">&lt;/&gt;</span>
            <span className="hidden text-2xl lg:inline">Hanaro TechBlog</span>
          </Link>

          {/* Center: Navigation (정중앙) */}
          <nav className="-translate-x-1/2 absolute left-1/2 hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                  isActive(link.href)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-border border-t py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-2 font-medium text-sm ${
                    isActive(link.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
