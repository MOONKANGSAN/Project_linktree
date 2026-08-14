/* 링크트리 관련 타입 정의 */

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

export interface LinktreePageProps {
  userId: string
}
