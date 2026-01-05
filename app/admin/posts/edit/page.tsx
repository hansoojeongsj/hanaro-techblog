import { EditForm } from '@/components/blog/EditForm';
import { prisma } from '@/lib/prisma';

export default async function EditPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;
  const postId = Number(id);

  // 진짜 DB에서 글 정보 가져오기
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  // 카테고리 목록 가져오기
  const categories = await prisma.category.findMany();

  if (!post) return <div>글을 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <EditForm
        initialPost={{
          id: String(post.id),
          title: post.title,
          content: post.content,
          categoryId: String(post.categoryId),
        }}
        categories={categories.map((c) => ({
          ...c,
          id: String(c.id),
          color: c.color === null ? undefined : c.color,
        }))}
      />
    </div>
  );
}
