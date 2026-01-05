import { redirect } from 'next/navigation';
import { PostForm } from '@/components/admin/PostForm';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handlePostAction } from '../post.action';

export default async function EditPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/login');

  const { id } = await searchParams;
  const postId = Number(id);

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id: postId } }),
    prisma.category.findMany(),
  ]);

  if (!post)
    return <div className="p-20 text-center">글을 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mx-auto mb-8 max-w-4xl font-bold text-3xl">글 수정하기</h1>
      <PostForm
        action={handlePostAction}
        initialData={{
          id: String(post.id),
          title: post.title,
          content: post.content,
          categoryId: String(post.categoryId),
        }}
        categories={categories.map((c) => ({
          ...c,
          id: String(c.id),
          color: c.color ?? undefined,
        }))}
        submitLabel="수정 완료"
      />
    </div>
  );
}
