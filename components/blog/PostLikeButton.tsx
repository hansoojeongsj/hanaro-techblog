'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { togglePostLike } from '@/app/(blog)/posts/[id]/like.action';
import { Button } from '@/components/ui/button';

interface PostLikeButtonProps {
  postId: number;
  userId: number | null | undefined;
  initialLikes: number;
  initialIsLiked: boolean;
}

export function PostLikeButton({
  postId,
  userId,
  initialLikes,
  initialIsLiked,
}: PostLikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likes, setLikes] = useState(initialLikes);

  // 서버 데이터가 바뀌면(다른 사람이 눌렀을 때 등) 상태 동기화
  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikes(initialLikes);
  }, [initialIsLiked, initialLikes]);

  const handleLike = async () => {
    // async 추가
    if (!userId) {
      toast.error('로그인이 필요합니다!');
      return;
    }

    // 1. 화면 먼저 바꾸기 (사용자 경험을 위해)
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes((prev) => (newLikedState ? prev + 1 : prev - 1));

    try {
      // 2. 진짜 서버(DB)에 저장하기
      await togglePostLike(postId, userId);

      toast(newLikedState ? '좋아요!' : '좋아요 취소');
    } catch (_) {
      // 에러 나면 다시 원래대로 돌리기
      setIsLiked(!newLikedState);
      setLikes(initialLikes);
      toast.error('오류가 발생했습니다.');
    }
  };

  return (
    <Button
      variant={'outline'}
      size="lg"
      onClick={handleLike}
      className={`gap-2 ${isLiked ? 'border-primary/20 bg-primary/10 text-primary' : ''}`}
    >
      <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
      {likes}
    </Button>
  );
}
