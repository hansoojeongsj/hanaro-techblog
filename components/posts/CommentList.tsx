'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  createComment,
  deleteComment,
  updateComment,
} from '@/app/posts/[id]/comment.action';
import { CommentForm } from './CommentForm';
import { CommentItem, type CommentType } from './CommentItem';

interface CommentListProps {
  initialComments: CommentType[];
  postId: number;
  currentUserId: number;
  isAdmin: boolean; // 👈 관리자 여부 추가
}

export function CommentList({
  initialComments,
  postId,
  currentUserId,
  isAdmin,
}: CommentListProps) {
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [replyToId, setReplyToId] = useState<string | null>(null);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleEditComment = async (id: string, newContent: string) => {
    try {
      await updateComment(Number(id), newContent, postId);
      toast.success('댓글이 수정되었습니다.');
    } catch (_) {
      toast.error('수정 실패');
    }
  };

  const handleAddComment = async (content: string) => {
    try {
      await createComment({
        postId,
        content,
        parentId: replyToId ? Number(replyToId) : null,
        writerId: currentUserId,
      });
      setReplyToId(null);
      toast.success('댓글이 등록되었습니다.');
    } catch (_) {
      toast.error('등록 실패');
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      await deleteComment(Number(id), postId);
      toast.success('삭제되었습니다.');
    } catch (_) {
      toast.error('삭제 실패');
    }
  };

  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parentId === parentId);

  return (
    <div className="space-y-8">
      <h3 className="font-bold text-xl">댓글 {comments.length}개</h3>
      <CommentForm
        onSubmit={handleAddComment}
        replyToId={replyToId}
        onCancelReply={() => setReplyToId(null)}
      />

      <div className="space-y-6">
        {rootComments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            <CommentItem
              comment={comment}
              onReply={setReplyToId}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
            {getReplies(comment.id).map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={setReplyToId}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                isReply={true}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
