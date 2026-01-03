import { FileText, type LucideIcon, MessageSquare, Users } from 'lucide-react';
import { comments, posts, users } from '@/data/mockData';

export function AdminStats() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      <StatCard icon={Users} count={users.length} label="전체 회원" />
      <StatCard icon={FileText} count={posts.length} label="전체 게시글" />
      <StatCard
        icon={MessageSquare}
        count={comments.length}
        label="전체 댓글"
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  count,
  label,
}: {
  icon: LucideIcon;
  count: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-bold text-2xl">{count}</p>
          <p className="text-muted-foreground text-sm">{label}</p>
        </div>
      </div>
    </div>
  );
}
