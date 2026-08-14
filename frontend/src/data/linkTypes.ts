/* 지원 플랫폼별 메타데이터 */
import type { LinkType } from '../types/link'

export interface LinkTypeMeta {
  label: string
  icon: string
  placeholder: string
  color: string
}

export const LINK_TYPE_META: Record<LinkType, LinkTypeMeta> = {
  none: {
    label: '(미정)',
    icon: '—',
    placeholder: '',
    color: '#94a3b8',
  },
  instagram: {
    label: '인스타그램',
    icon: '📸',
    placeholder: 'https://instagram.com/username',
    color: '#e1306c',
  },
  youtube: {
    label: '유튜브',
    icon: '▶️',
    placeholder: 'https://youtube.com/@channel',
    color: '#ff0000',
  },
  naver_blog: {
    label: '네이버블로그',
    icon: '📝',
    placeholder: 'https://blog.naver.com/username',
    color: '#03c75a',
  },
  notion: {
    label: '노션',
    icon: '📋',
    placeholder: 'https://notion.so/page-id',
    color: '#000000',
  },
  github: {
    label: '깃허브',
    icon: '🐙',
    placeholder: 'https://github.com/username',
    color: '#24292e',
  },
  facebook: {
    label: '페이스북',
    icon: '👥',
    placeholder: 'https://facebook.com/username',
    color: '#1877f2',
  },
  portfolio: {
    label: '포트폴리오',
    icon: '💼',
    placeholder: 'https://my-portfolio.com',
    color: '#f59e0b',
  },
}

export const LINK_TYPES = Object.keys(LINK_TYPE_META) as LinkType[]
