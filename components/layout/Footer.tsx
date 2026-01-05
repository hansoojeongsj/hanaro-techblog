'use client';

import Link from 'next/link';
import { toast } from 'sonner';

export default function Footer() {
  const handleAlert = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info('추후 업데이트 예정입니다.');
  };

  const categories = [
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'React', slug: 'react' },
    { name: 'Next.js', slug: 'nextjs' },
  ];

  return (
    <footer className="mt-auto border-t bg-card text-muted-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <h4 className="font-bold font-mono text-primary text-xl">
              Hanaro TechBlog
            </h4>
            <p className="text-sm leading-relaxed">
              프론트엔드 개발자를 위한 기술 블로그입니다.
              <br />
              최신 웹 기술과 개발 트렌드를 공유합니다.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">카테고리</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">링크</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  onClick={handleAlert}
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
                  onClick={handleAlert}
                  className="transition-colors hover:text-foreground"
                >
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-xs">
          <p>© 2026 TechBlog. Digital Hana 路 금융서비스개발 8기</p>
        </div>
      </div>
    </footer>
  );
}
