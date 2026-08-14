/* 하드코딩된 유저 데이터 (추후 API로 교체) */
import type { UserProfile } from '../types/linktree'

export const HARDCODED_USERS: Record<string, UserProfile> = {
  demo: {
    id: 'demo',
    displayName: '김개발',
    username: '@kimdev',
    bio: '풀스택 개발자 | 커피 ☕ 없이는 코딩 못 함 | 블로그 운영 중',
    avatarEmoji: '👨‍💻',
    themeColor: '#7c3aed',
    links: [
      { id: 1, label: 'GitHub', url: 'https://github.com', icon: '🐙', color: '#1f2937' },
      { id: 2, label: '개발 블로그', url: 'https://velog.io', icon: '✍️', color: '#1e9c52' },
      { id: 3, label: '유튜브 채널', url: 'https://youtube.com', icon: '▶️', color: '#ef4444' },
      { id: 4, label: '인스타그램', url: 'https://instagram.com', icon: '📸', color: '#ec4899' },
      { id: 5, label: '포트폴리오', url: 'https://example.com', icon: '💼', color: '#0ea5e9' },
    ],
  },
  jane: {
    id: 'jane',
    displayName: '이제인',
    username: '@jane_design',
    bio: 'UI/UX 디자이너 | 그림 그리는 것을 좋아해요 🎨',
    avatarEmoji: '🎨',
    themeColor: '#db2777',
    links: [
      { id: 1, label: '디자인 포트폴리오', url: 'https://behance.net', icon: '🖼️', color: '#0057ff' },
      { id: 2, label: '인스타그램', url: 'https://instagram.com', icon: '📸', color: '#ec4899' },
      { id: 3, label: '노션 페이지', url: 'https://notion.so', icon: '📋', color: '#374151' },
    ],
  },
}
