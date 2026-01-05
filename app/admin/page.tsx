import Link from 'next/link';
import { AdminStats } from '@/components/admin/AdminStats';
import { CommentTab } from '@/components/admin/CommentTab';
import { PostTab } from '@/components/admin/PostTab';
import { UserTab } from '@/components/admin/UserTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { anonymizeOldUsersAction } from './admin.action';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    postPage?: string;
    commentPage?: string;
    tab?: string;
    search?: string;
  }>;
}) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') return <div>권한이 없습니다.</div>;
  const params = await searchParams;
  const activeTab = params.tab || 'users';
  const searchTerm = params.search || ''; // 검색어 추출
  const pageSize = 20;

  // 통계 데이터 조회
  const [userCount, postCount, commentCount] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.post.count({ where: { isDeleted: false } }),
    prisma.comment.count({ where: { isDeleted: false } }),
  ]);

  let content: React.ReactNode;

  // 탭별 전체 검색 쿼리 적용
  if (activeTab === 'users') {
    const page = Number(params.page) || 1;
    // 검색 조건: 이름 또는 이메일에 포함된 경우
    const where = searchTerm
      ? {
          OR: [
            { name: { contains: searchTerm } },
            { email: { contains: searchTerm } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }), // 검색된 결과의 전체 개수
    ]);

    content = (
      <UserTab
        initialUsers={users}
        currentPage={page}
        totalPages={Math.ceil(total / pageSize)}
      />
    );
  } else if (activeTab === 'posts') {
    const page = Number(params.postPage) || 1;
    const where = searchTerm
      ? {
          title: { contains: searchTerm },
          isDeleted: false,
        }
      : {};

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          writer: { select: { name: true, isDeleted: true } },
          category: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where }),
    ]);

    content = (
      <PostTab
        initialPosts={posts}
        currentPage={page}
        totalPages={Math.ceil(total / pageSize)}
      />
    );
  } else if (activeTab === 'comments') {
    const page = Number(params.commentPage) || 1;
    const where = searchTerm
      ? {
          content: { contains: searchTerm },
          isDeleted: false,
        }
      : {};

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          writer: { select: { name: true, isDeleted: true } },
          post: { select: { title: true, isDeleted: true, id: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.count({ where }),
    ]);

    content = (
      <CommentTab
        initialComments={comments}
        currentPage={page}
        totalPages={Math.ceil(total / pageSize)}
      />
    );
  }

  await anonymizeOldUsersAction();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-bold text-3xl">관리자 페이지</h1>
          <p className="text-muted-foreground">
            회원, 게시글, 댓글을 한눈에 관리하세요.
          </p>
        </div>
      </div>

      <AdminStats
        userCount={userCount}
        postCount={postCount}
        commentCount={commentCount}
      />

      <Tabs value={activeTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="users" asChild>
            <Link href="/admin?tab=users">회원 관리</Link>
          </TabsTrigger>
          <TabsTrigger value="posts" asChild>
            <Link href="/admin?tab=posts">글 관리</Link>
          </TabsTrigger>
          <TabsTrigger value="comments" asChild>
            <Link href="/admin?tab=comments">댓글 관리</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>{content}</TabsContent>
      </Tabs>
    </div>
  );
}
