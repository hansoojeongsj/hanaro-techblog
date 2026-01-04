import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// ------------------------------------------------------------
// 🛠️ 헬퍼 함수들 (랜덤 데이터 생성용)
// ------------------------------------------------------------
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
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
  console.log('🌱 시드 데이터 생성을 시작합니다...');

  // ------------------------------------------------------------
  // 1. 카테고리 데이터 (님 기존 코드 그대로 포함! 🎨)
  // ------------------------------------------------------------
  const categoriesData = [
    {
      name: 'JavaScript',
      slug: 'javascript',
      icon: '🟨',
      color: '#F7DF1E',
      description: '웹의 근간이 되는 프로그래밍 언어 JavaScript에 대한 글',
    },
    {
      name: 'TypeScript',
      slug: 'typescript',
      icon: '🔷',
      color: '#3178C6',
      description: '타입 안정성을 제공하는 TypeScript 관련 글',
    },
    {
      name: 'React',
      slug: 'react',
      icon: '⚛️',
      color: '#61DAFB',
      description: 'Facebook이 만든 UI 라이브러리 React 관련 글',
    },
    {
      name: 'Next.js',
      slug: 'nextjs',
      icon: '▲',
      color: '#000000',
      description: 'React 기반 풀스택 프레임워크 Next.js 관련 글',
    },
    {
      name: 'CSS',
      slug: 'css',
      icon: '🎨',
      color: '#264DE4',
      description: '스타일링과 레이아웃에 관한 CSS 글',
    },
    {
      name: 'Git',
      slug: 'git',
      icon: '🔀',
      color: '#F05032',
      description: '버전 관리 시스템 Git 관련 글',
    },
  ];

  // 카테고리 생성 (기존 내용 유지 + 설명 추가)
  await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          description: cat.description,
        },
        create: {
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          color: cat.color,
          description: cat.description,
        },
      }),
    ),
  );
  console.log('✅ 카테고리 데이터 준비 완료');

  // ------------------------------------------------------------
  // 2. 유저 준비 (관리자 + 유령 회원 50명)
  // ------------------------------------------------------------
  const password = await hash('1234', 12); // 비밀번호 "1234"

  // 2-1. 관리자 (admin@hanaro.com)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hanaro.com' },
    update: { passwd: password, role: 'ADMIN' },
    create: {
      email: 'admin@hanaro.com',
      name: '관리자',
      passwd: password,
      role: 'ADMIN',
    },
  });

  // 2-2. 유령 회원 50명 (댓글/좋아요 셔틀)
  const dummyUsers = [];
  console.log('👻 유령 회원 50명 생성 중...');

  for (let i = 1; i <= 50; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@test.com` },
      update: { passwd: password },
      create: {
        email: `user${i}@test.com`,
        name: `유저${i}`,
        passwd: password,
        role: 'USER',
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`, // 랜덤 아바타
      },
    });
    dummyUsers.push(user);
  }

  // 전체 유저 리스트 (관리자 + 유령들)
  const allUsers = [admin, ...dummyUsers];

  // ------------------------------------------------------------
  // 3. 게시글 & 댓글 & 좋아요 랜덤 생성
  // ------------------------------------------------------------
  const titles = [
    '완벽 가이드',
    '핵심 정리',
    '10분 컷',
    '실무 꿀팁',
    '에러 해결법',
    '원리 파헤치기',
    '면접 질문',
    '트렌드 분석',
    '튜토리얼',
    '고급 기법',
  ];
  const slugs = ['javascript', 'typescript', 'react', 'nextjs', 'css', 'git'];

  console.log('📝 게시글 20개 및 댓글/좋아요 작업 시작...');

  for (let i = 1; i <= 20; i++) {
    const randomSlug = getRandomElement(slugs);
    const randomTitle = getRandomElement(titles);

    // 작성자는 관리자 혹은 랜덤 유저 중 한 명
    const writer = getRandomElement(allUsers);

    // 3-1. 게시글 생성
    const post = await prisma.post.create({
      data: {
        title: `[${randomSlug}] ${randomTitle} ${i}`,
        content: `# ${randomTitle}\n\n이 글은 **${randomSlug}**에 대한 ${i}번째 테스트 글입니다.\n\n## 목차\n1. 개요\n2. 본문\n3. 결론\n\n내용이 아주 길수도 있고 짧을 수도 있습니다.\n\n\`\`\`javascript\nconsole.log("Hello World");\n\`\`\``,
        views: getRandomInt(10, 5000),

        // 카테고리 연결
        category: { connect: { slug: randomSlug } },
        // 작성자 연결
        writer: { connect: { id: writer.id } },

        createdAt: new Date(new Date().setDate(new Date().getDate() - i)),
      },
    });

    // ----------------------------------------------------------
    // 3-2. 좋아요 생성 (0 ~ 50개 랜덤)
    // ----------------------------------------------------------
    const shuffledUsers = [...allUsers].sort(() => 0.5 - Math.random());
    const likeCount = getRandomInt(0, shuffledUsers.length); // 0 ~ 51개 랜덤
    const likeUsers = shuffledUsers.slice(0, likeCount);

    if (likeUsers.length > 0) {
      await prisma.postLike.createMany({
        data: likeUsers.map((u) => ({
          userId: u.id,
          postId: post.id,
        })),
        skipDuplicates: true,
      });
    }

    // ----------------------------------------------------------
    // 3-3. 댓글 생성 (계층형: 댓글 -> 대댓글 -> 대대댓글)
    // ----------------------------------------------------------
    // 70% 확률로 댓글이 달림
    if (Math.random() > 0.3) {
      const rootCommentCount = getRandomInt(1, 5); // 1~5개의 댓글

      for (let j = 0; j < rootCommentCount; j++) {
        const commenter = getRandomElement(allUsers);

        // 1차 댓글
        const parent = await prisma.comment.create({
          data: {
            content: getRandomElement(randomComments),
            postId: post.id,
            writerId: commenter.id,
            createdAt: new Date(Date.now() - getRandomInt(10000, 1000000)),
          },
        });

        // 50% 확률로 답글(대댓글)
        if (Math.random() > 0.5) {
          const childCount = getRandomInt(1, 3);
          for (let k = 0; k < childCount; k++) {
            const childCommenter = getRandomElement(allUsers);

            // 2차 대댓글
            const child = await prisma.comment.create({
              data: {
                content: `└ @${commenter.name} 답글입니다. ${getRandomElement(randomComments)}`,
                postId: post.id,
                writerId: childCommenter.id,
                parentId: parent.id, // 부모 ID 연결
              },
            });

            // 30% 확률로 대대댓글
            if (Math.random() > 0.7) {
              await prisma.comment.create({
                data: {
                  content: `└└ @${childCommenter.name} 님 말에 동의합니다 ㅋㅋ`,
                  postId: post.id,
                  writerId: getRandomElement(allUsers).id,
                  parentId: child.id, // 부모의 부모 ID 연결
                },
              });
            }
          }
        }
      }
    }
  }

  console.log('🎉 모든 시드 데이터 생성 완료!');
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
