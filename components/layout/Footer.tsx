'use client';

import Link from 'next/link';
import { toast } from 'sonner';

export default function Footer() {
  const handleNotImplemented = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    toast('추후 업데이트 예정입니다.');
  };

  return (
    <footer className="mt-auto border-border border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <h4 className="flex items-center gap-2 font-bold font-mono text-primary text-xl">
              <span>Hanaro TechBlog</span>
            </h4>
            <p className="text-muted-foreground text-sm">
              프론트엔드 개발자를 위한 기술 블로그입니다.
              <br />
              최신 웹 기술과 개발 트렌드를 공유합니다.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">카테고리</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link
                  href="/categories/javascript"
                  className="transition-colors hover:text-foreground"
                >
                  JavaScript
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/typescript"
                  className="transition-colors hover:text-foreground"
                >
                  TypeScript
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/react"
                  className="transition-colors hover:text-foreground"
                >
                  React
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/nextjs"
                  className="transition-colors hover:text-foreground"
                >
                  Next.js
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">링크</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link
                  href="#"
                  onClick={handleNotImplemented}
                  className="transition-colors hover:text-foreground"
                >
                  소개
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="transition-colors hover:text-foreground"
                >
                  전체 글
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={handleNotImplemented}
                  className="transition-colors hover:text-foreground"
                >
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-border border-t pt-8 text-center text-muted-foreground text-sm">
          <p>© 2026 TechBlog. Digital Hana 路 금융서비스개발 8기</p>
        </div>
      </div>
    </footer>
  );
}
