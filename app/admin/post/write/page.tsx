import { redirect } from 'next/navigation';
import { PostForm } from '@/components/admin/PostForm';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handlePostAction } from '../post.action';

export default async function WritePage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/login');

  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
  });

  const formattedCategories = categories.map((c) => ({
    id: String(c.id),
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mx-auto mb-8 max-w-4xl font-bold text-3xl">새 글 작성</h1>
      <PostForm
        action={handlePostAction}
        categories={formattedCategories}
        submitLabel="발행하기"
      />
    </div>
  );
}
