'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Comment, CurrentUser } from '@/app/(blog)/blog.type';
import {
  createComment,
  deleteComment,
  updateComment,
} from '@/app/(blog)/posts/[id]/comment.action';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

type CommentListProps = {
  initialComments: Comment[];
  postId: number;
  currentUser: CurrentUser | null;
};

export function CommentList({
  initialComments,
  postId,
  currentUser,
}: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replyToId, setReplyToId] = useState<number | null>(null);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleReplyClick = (id: number) => {
    setReplyToId((prev) => (prev === id ? null : id));
  };

  const handleEditStart = () => {
    setReplyToId(null);
  };

  const handleEditComment = async (id: number, newContent: string) => {
    setReplyToId(null);
    try {
      await updateComment(id, newContent, postId);
      toast.success('댓글이 수정되었습니다.');
    } catch (_) {
      toast.error('수정 실패');
    }
  };

  const handleAddComment = async (content: string) => {
    if (!currentUser || !currentUser.id) {
      toast.error('로그인이 필요합니다.');
      return;
    }
    try {
      await createComment({
        postId,
        content,
        parentId: replyToId,
        writerId: currentUser.id,
      });
      setReplyToId(null);
      toast.success('댓글이 등록되었습니다.');
    } catch (_) {
      toast.error('등록 실패');
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      await deleteComment(id, postId);
      toast.success('삭제되었습니다.');
    } catch (_) {
      toast.error('삭제 실패');
    }
  };

  const rootComments = comments.filter((c) => !c.parentId);

  const getReplies = (parentId: number) =>
    comments.filter((c) => c.parentId === parentId);

  return (
    <div className="space-y-8">
      <h3 className="font-bold text-xl">댓글 {comments.length}개</h3>
      <CommentForm
        onSubmit={handleAddComment}
        replyToId={replyToId}
        onCancelReply={() => setReplyToId(null)}
        currentUser={currentUser}
      />

      <div className="space-y-6">
        {rootComments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            <CommentItem
              comment={comment}
              onReply={() => handleReplyClick(comment.id)}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onEditStart={handleEditStart}
              currentUser={currentUser}
            />
            {getReplies(comment.id).map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={() => handleReplyClick(reply.id)}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                onEditStart={handleEditStart}
                isReply={true}
                currentUser={currentUser}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
