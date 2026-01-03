'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { CommentForm } from './CommentForm';
import { CommentItem, type CommentType } from './CommentItem';

// 초기 더미 데이터 (부모에서 받아와도 됨)
const initialComments: CommentType[] = [
  {
    id: '1',
    author: {
      name: '김철수',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    },
    content: '정말 유익한 글이네요! 잘 읽었습니다.',
    createdAt: new Date().toISOString(),
    parentId: null,
  },
  {
    id: '2',
    author: {
      name: '이영희',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    },
    content: '감사합니다 :)',
    createdAt: new Date().toISOString(),
    parentId: '1', // 대댓글
  },
];

export function CommentList() {
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [replyToId, setReplyToId] = useState<string | null>(null);

  // 댓글 등록 핸들러
  const handleAddComment = (content: string) => {
    const newComment: CommentType = {
      id: crypto.randomUUID(), // 임시 ID 생성
      author: {
        name: '나(Guest)',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      },
      content,
      createdAt: new Date().toISOString(),
      parentId: replyToId, // 대댓글이면 부모 ID 들어감
    };

    // 상태 업데이트 (화면에 바로 반영됨!)
    setComments((prev) => [...prev, newComment]);
    setReplyToId(null); // 답글 모드 해제

    toast.success('댓글이 등록되었습니다.');
  };

  const handleEditComment = (id: string, newContent: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id ? { ...comment, content: newContent } : comment,
      ),
    );
    toast.success('댓글이 수정되었습니다.');
  };

  const handleDeleteComment = (id: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id ? { ...comment, isDeleted: true } : comment,
      ),
    );
    toast.success('댓글이 삭제되었습니다.');
  };

  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parentId === parentId);
  return (
    <div className="space-y-8">
      <h3 className="font-bold text-xl">댓글 {comments.length}개</h3>

      {/* 메인 댓글 작성 폼 (답글 모드가 아닐 때만 보임, 혹은 항상 보임 선택) */}
      <CommentForm
        onSubmit={handleAddComment}
        replyToId={replyToId}
        onCancelReply={() => setReplyToId(null)}
      />

      <div className="space-y-6">
        {rootComments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            {/* 부모 댓글 */}
            <CommentItem
              comment={comment}
              onReply={setReplyToId}
              onEdit={handleEditComment} // ✨ 전달
              onDelete={handleDeleteComment} // ✨ 전달
            />

            {/* 대댓글 렌더링 (들여쓰기 적용됨) */}
            {getReplies(comment.id).map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={setReplyToId}
                onEdit={handleEditComment} // ✨ 전달
                onDelete={handleDeleteComment} // ✨ 전달
                isReply={true}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
