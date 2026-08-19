/* 링크트리 관련 타입 정의 */

// 하드코딩 데모 데이터용
export interface LinkItem {
  id: number
  label: string
  url: string
  icon: string
  color: string
}

export interface UserProfile {
  id: string
  displayName: string
  username: string
  bio: string
  avatarEmoji: string
  themeColor: string
  links: LinkItem[]
}

// 백엔드 API 응답 타입
export interface ApiBranch {
  idx: number
  label: string
  url: string
  inputType: string
  filePath: string | null
}

export interface ApiLink {
  idx: number
  linkType: string
  label: string
  url: string
  portfolioInputType: string | null
  filePath: string | null
  hasBranch: boolean
  sortOrder: number
  branches: ApiBranch[]
}

export interface PublicProfile {
  loginId: string
  shareToken: string | null
  nickname: string | null
  bio1: string | null
  bio2: string | null
  bio3: string | null
  photoPath: string | null
  links: ApiLink[]
}

export interface LinktreePageProps {
  userId: string
}

// 검색 결과 응답 타입 (GET /api/public/search?keyword=)
export interface SearchResultItem {
  loginId: string
  nickname: string | null
  photoPath: string | null
  bio1: string | null
}
