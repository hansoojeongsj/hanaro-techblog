import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminStats } from './components/AdminStats';
import { CommentTab } from './components/CommentTab';
import { PostTab } from './components/PostTab';
import { UserTab } from './components/UserTab';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 1. 헤더 영역 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-bold text-3xl">관리자 페이지</h1>
          <p className="text-muted-foreground">
            회원, 게시글, 댓글을 한눈에 관리하세요.
          </p>
        </div>
        <Badge variant="secondary" className="h-8 gap-2 px-4">
          <Shield className="h-4 w-4" />
          관리자 모드
        </Badge>
      </div>

      {/* 2. 통계 카드 영역 */}
      <AdminStats />

      {/* 3. 탭 영역 */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="users">회원 관리</TabsTrigger>
          <TabsTrigger value="posts">글 관리</TabsTrigger>
          <TabsTrigger value="comments">댓글 관리</TabsTrigger>
        </TabsList>

        {/* 각 탭의 내용은 별도 컴포넌트가 담당 */}
        <TabsContent value="users">
          <UserTab />
        </TabsContent>

        <TabsContent value="posts">
          <PostTab />
        </TabsContent>

        <TabsContent value="comments">
          <CommentTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
