import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const getRandomPastDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(getRandomInt(0, 23), getRandomInt(0, 59), getRandomInt(0, 59));
  return date;
};

const getRandomDateBetween = (start: Date, end: Date) => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  return new Date(startTime + Math.random() * (endTime - startTime));
};

const randomComments = [
  '정말 좋은 글이네요! 👍',
  '덕분에 많이 배워갑니다.',
  '이 부분은 좀 이해가 안 되는데 설명 부탁드려요.',
  '오 꿀팁 감사합니다!',
  '저도 같은 에러로 고생했는데 해결했어요 ㅠㅠ',
  '다음 글도 기대할게요!',
  '깔끔한 정리 굿굿',
  '스크랩 해갑니다~',
  '질문 있습니다. 혹시 버전 몇 기준인가요?',
  '와 대박...',
];

async function main() {
  console.log('🧹 기존 데이터를 싹 비웁니다...');
  await prisma.postLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 시드 데이터 생성을 시작합니다...');

  const categoriesData = [
    {
      name: 'JavaScript',
      slug: 'javascript',
      icon: '🟨',
      description: '웹의 근간이 되는 프로그래밍 언어 JavaScript에 대한 글',
    },
    {
      name: 'TypeScript',
      slug: 'typescript',
      icon: '🔷',
      description: '타입 안정성을 제공하는 TypeScript 관련 글',
    },
    {
      name: 'React',
      slug: 'react',
      icon: '⚛️',
      description: 'Facebook이 만든 UI 라이브러리 React 관련 글',
    },
    {
      name: 'Next.js',
      slug: 'nextjs',
      icon: '▲',
      description: 'React 기반 풀스택 프레임워크 Next.js 관련 글',
    },
    {
      name: 'CSS',
      slug: 'css',
      icon: '🎨',
      description: '스타일링과 레이아웃에 관한 CSS 글',
    },
    {
      name: 'Git',
      slug: 'git',
      icon: '🔀',
      description: '버전 관리 시스템 Git 관련 글',
    },
  ];

  await prisma.category.createMany({ data: categoriesData });
  const allCategories = await prisma.category.findMany();

  const password = await hash('1234', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hanaro.com',
      name: '관리자',
      passwd: password,
      role: 'ADMIN',
    },
  });

  console.log('👥 일반 사용자 50명 생성 중...');
  const dummyUsers = [];
  for (let i = 1; i <= 50; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@test.com`,
        name: `일반유저${i}`,
        passwd: password,
        role: 'USER',
      },
    });
    dummyUsers.push(user);
  }

  console.log('📝 잔디용 게시글 생성 중...');
  const postTitles = ['가이드', '핵심정리', '꿀팁', '분석', '튜토리얼', '회고'];
  const DAYS_RANGE = 90;

  for (let i = 1; i <= 30; i++) {
    const category = getRandomElement(allCategories);

    const daysAgo = getRandomInt(1, DAYS_RANGE);
    const createdAt = getRandomPastDate(daysAgo);

    let updatedAt = createdAt;
    if (Math.random() < 0.3) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      updatedAt = getRandomDateBetween(createdAt, yesterday);
    }

    const post = await prisma.post.create({
      data: {
        title: `${category.name} ${getRandomElement(postTitles)} #${i}`,
        content: `${category.name}에 대한 심도 깊은 내용을 다룹니다.
관리자가 작성한 소중한 글입니다.

엔터 반영 테스트
줄바꿈이 잘 되나요?`,
        views: getRandomInt(100, 1000),
        isDeleted: i % 10 === 0,
        categoryId: category.id,
        writerId: admin.id,
        createdAt,
        updatedAt,
      },
    });

    const likeCount = getRandomInt(5, 30);
    const likeUsers = [...dummyUsers]
      .sort(() => 0.5 - Math.random())
      .slice(0, likeCount);

    await prisma.postLike.createMany({
      data: likeUsers.map((u) => ({
        userId: u.id,
        postId: post.id,
      })),
    });

    if (Math.random() > 0.1) {
      const commentCount = getRandomInt(2, 6);
      for (let j = 0; j < commentCount; j++) {
        const rootCommenter = getRandomElement(dummyUsers);
        const rootComment = await prisma.comment.create({
          data: {
            content: getRandomElement(randomComments),
            postId: post.id,
            writerId: rootCommenter.id,
            isDeleted: Math.random() > 0.8,
          },
        });

        if (Math.random() > 0.4) {
          const replyCount = getRandomInt(1, 3);
          for (let k = 0; k < replyCount; k++) {
            await prisma.comment.create({
              data: {
                content: `└ 답글입니다: ${getRandomElement(randomComments)}`,
                postId: post.id,
                writerId: getRandomElement(dummyUsers).id,
                parentId: rootComment.id,
              },
            });
          }
        }
      }
    }
  }

  console.log('🎉 시드 데이터 생성 완료!');
  console.log('✅ 관리자 계정: admin@hanaro.com / 비밀번호: 1234');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
