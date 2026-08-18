/* 링크 등록 관련 타입 정의 */

export type LinkType =
  | 'none'        // 미정 (기본값)
  | 'instagram'
  | 'youtube'
  | 'naver_blog'
  | 'notion'
  | 'github'
  | 'facebook'
  | 'portfolio'

export type PortfolioInputType = 'url' | 'file'

// 가지치기 하위 링크 — URL/파일 각각 선택 가능
export interface BranchItem {
  id: string
  label: string
  url: string
  inputType: PortfolioInputType
  file: File | null
  existingFilePath?: string | null  // 수정 시 기존 파일 경로
}

export interface LinkFormItem {
  id: string
  type: LinkType
  label: string
  url: string
  portfolioInputType: PortfolioInputType
  portfolioFile: File | null
  existingFilePath?: string | null  // 수정 시 기존 파일 경로
  hasBranch: boolean
  branches: BranchItem[]
}

// 프로필 폼 상태
export interface ProfileForm {
  photo: File | null
  photoPreview: string
  visibility: number  // 1:나만보기 / 2:전체공개(기본) / 3:링크받은사람만
  nickname: string
  bios: string[]
}
