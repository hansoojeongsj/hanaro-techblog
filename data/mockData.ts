export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  postCount: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  categoryId: string;
  category?: Category;
  authorId: string;
  author?: User;
  likes: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  author?: User;
  parentId?: string;
  replies?: Comment[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrassData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'JavaScript',
    slug: 'javascript',
    color: 'bg-yellow-500',
    postCount: 12,
  },
  {
    id: '2',
    name: 'TypeScript',
    slug: 'typescript',
    color: 'bg-blue-500',
    postCount: 8,
  },
  {
    id: '3',
    name: 'React',
    slug: 'react',
    color: 'bg-cyan-500',
    postCount: 15,
  },
  {
    id: '4',
    name: 'Next.js',
    slug: 'nextjs',
    color: 'bg-foreground',
    postCount: 6,
  },
  { id: '5', name: 'CSS', slug: 'css', color: 'bg-pink-500', postCount: 4 },
  { id: '6', name: 'Git', slug: 'git', color: 'bg-orange-500', postCount: 3 },
];

export const users: User[] = [
  {
    id: '1',
    email: 'admin@hanaro.dev',
    name: '관리자',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'dev@hanaro.dev',
    name: '김개발',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev',
    role: 'user',
    createdAt: new Date('2024-06-15'),
  },
  {
    id: '3',
    email: 'user@hanaro.dev',
    name: '박프론트',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    role: 'user',
    createdAt: new Date('2024-09-20'),
  },
];

export const posts: Post[] = [
  {
    id: '1',
    title: 'React 18의 새로운 기능들 살펴보기',
    content: `React 18에서는 많은 새로운 기능들이 추가되었습니다. 오늘은 그 중에서도 가장 중요한 기능들을 살펴보겠습니다.

## Concurrent Rendering

React 18의 가장 큰 변화는 Concurrent Rendering입니다. 이를 통해 React는 여러 작업을 동시에 처리할 수 있게 되었습니다.

\`\`\`javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
\`\`\`

## Automatic Batching

이제 React는 자동으로 여러 상태 업데이트를 배치 처리합니다.

\`\`\`javascript
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React는 이 두 업데이트를 하나의 리렌더링으로 처리합니다
}
\`\`\``,
    excerpt:
      'React 18에서 추가된 Concurrent Rendering, Automatic Batching 등 주요 기능들을 살펴봅니다.',
    categoryId: '3',
    authorId: '1',
    likes: 42,
    commentCount: 8,
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2024-12-28'),
  },
  {
    id: '2',
    title: 'TypeScript 제네릭 완벽 가이드',
    content: `TypeScript의 제네릭은 코드의 재사용성을 높이는 강력한 기능입니다.

## 기본 제네릭

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>('hello');
\`\`\`

## 제네릭 제약조건

\`\`\`typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
\`\`\``,
    excerpt: 'TypeScript 제네릭의 기본 개념부터 고급 활용법까지 알아봅니다.',
    categoryId: '2',
    authorId: '2',
    likes: 35,
    commentCount: 5,
    createdAt: new Date('2024-12-27'),
    updatedAt: new Date('2024-12-27'),
  },
  {
    id: '3',
    title: 'JavaScript 클로저 이해하기',
    content: `클로저는 JavaScript의 핵심 개념 중 하나입니다.

## 클로저란?

클로저는 함수와 그 함수가 선언될 당시의 렉시컬 환경의 조합입니다.

\`\`\`javascript
function outer() {
  const x = 10;
  
  function inner() {
    console.log(x); // 클로저로 인해 x에 접근 가능
  }
  
  return inner;
}

const closure = outer();
closure(); // 10
\`\`\``,
    excerpt: 'JavaScript 클로저의 동작 원리와 실전 활용법을 알아봅니다.',
    categoryId: '1',
    authorId: '3',
    likes: 28,
    commentCount: 3,
    createdAt: new Date('2024-12-26'),
    updatedAt: new Date('2024-12-26'),
  },
  {
    id: '4',
    title: 'Next.js App Router 마이그레이션 가이드',
    content: `Pages Router에서 App Router로 마이그레이션하는 방법을 알아봅니다.

## 파일 구조 변경

\`\`\`
// Before (Pages Router)
pages/
  index.tsx
  about.tsx
  
// After (App Router)
app/
  page.tsx
  about/
    page.tsx
\`\`\`

## 데이터 페칭

\`\`\`typescript
// App Router에서의 데이터 페칭
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <main>{/* ... */}</main>;
}
\`\`\``,
    excerpt: 'Next.js App Router로의 마이그레이션 과정을 단계별로 설명합니다.',
    categoryId: '4',
    authorId: '1',
    likes: 56,
    commentCount: 12,
    createdAt: new Date('2024-12-25'),
    updatedAt: new Date('2024-12-26'),
  },
  {
    id: '5',
    title: 'Git 브랜치 전략: Git Flow vs GitHub Flow',
    content: `효과적인 Git 브랜치 전략을 비교해봅니다.

## Git Flow

Git Flow는 기능 개발, 릴리스, 핫픽스를 위한 별도의 브랜치를 사용합니다.

- main: 프로덕션 코드
- develop: 개발 브랜치
- feature/*: 기능 개발
- release/*: 릴리스 준비
- hotfix/*: 긴급 수정

## GitHub Flow

더 간단한 브랜치 전략입니다.

- main: 항상 배포 가능한 상태
- feature branches: 기능 개발 후 PR`,
    excerpt: 'Git Flow와 GitHub Flow의 차이점과 각각의 장단점을 비교합니다.',
    categoryId: '6',
    authorId: '2',
    likes: 19,
    commentCount: 4,
    createdAt: new Date('2024-12-24'),
    updatedAt: new Date('2024-12-24'),
  },
];

export const comments: Comment[] = [
  {
    id: '1',
    content:
      '정말 유익한 글이네요! React 18 관련해서 궁금한 게 많았는데 많이 배웠습니다.',
    postId: '1',
    authorId: '2',
    isDeleted: false,
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2024-12-28'),
  },
  {
    id: '2',
    content: 'Concurrent Rendering에 대해 더 자세히 알고 싶어요!',
    postId: '1',
    authorId: '3',
    parentId: '1',
    isDeleted: false,
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2024-12-28'),
  },
  {
    id: '3',
    content: '제네릭 설명이 정말 깔끔하네요. 감사합니다!',
    postId: '2',
    authorId: '1',
    isDeleted: false,
    createdAt: new Date('2024-12-27'),
    updatedAt: new Date('2024-12-27'),
  },
];

// Generate grass data for the last 365 days
export function generateGrassData(): GrassData[] {
  const data: GrassData[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Random count with some patterns
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseChance = isWeekend ? 0.3 : 0.6;

    let count = 0;
    if (Math.random() < baseChance) {
      count = Math.floor(Math.random() * 5);
    }

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count === 0) level = 0;
    else if (count === 1) level = 1;
    else if (count === 2) level = 2;
    else if (count === 3) level = 3;
    else level = 4;

    data.push({
      date: date.toISOString().split('T')[0],
      count,
      level,
    });
  }

  return data;
}

export const grassData = generateGrassData();
