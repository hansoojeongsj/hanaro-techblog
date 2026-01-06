'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { CurrentUser } from '@/app/(blog)/blog.type';
import { togglePostLike } from '@/app/(blog)/posts/[id]/like.action';
import { Button } from '@/components/ui/button';

type PostLikeButtonProps = {
  postId: number;
  currentUser: CurrentUser | null;
  initialLikes: number;
  initialIsLiked: boolean;
};

export function PostLikeButton({
  postId,
  currentUser,
  initialLikes,
  initialIsLiked,
}: PostLikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likes, setLikes] = useState(initialLikes);

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikes(initialLikes);
  }, [initialIsLiked, initialLikes]);

  const handleLike = async () => {
    if (!currentUser || !currentUser.id) {
      toast.error('로그인이 필요합니다!');
      return;
    }

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes((prev) => (newLikedState ? prev + 1 : prev - 1));

    try {
      await togglePostLike(postId);

      toast(newLikedState ? '좋아요!' : '좋아요 취소');
    } catch (_) {
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
