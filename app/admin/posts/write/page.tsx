'use server';

import { redirect } from 'next/navigation';
import { WriteForm } from '@/components/blog/WriteForm';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export default async function WritePage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }
  const categoriesData = await prisma.category.findMany({
    select: { id: true, name: true, color: true },
  });

  const formattedCategories = categoriesData.map((c) => ({
    ...c,
    id: String(c.id),
    color: c.color ?? '',
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-bold text-3xl">새 글 작성</h1>
        <WriteForm categories={formattedCategories} />
      </div>
    </div>
  );
}
