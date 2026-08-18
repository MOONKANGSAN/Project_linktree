/* 링크트리 프로필 페이지: /:userId 경로로 접근 시 노출 */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { PublicProfile, ApiLink, ApiBranch } from '../types/linktree'
import { HARDCODED_USERS } from '../data/users'
import { LINK_TYPE_META } from '../data/linkTypes'
import './LinktreePage.css'

const DEMO = HARDCODED_USERS['demo']
const MAX_BRANCHES_VIEW = 4

/* ── 가지치기 카드 목록 — 항상 4칸 기준 그리드 ── */
function BranchList({ branches, color }: { branches: ApiBranch[]; color: string }) {
  const items = branches.slice(0, MAX_BRANCHES_VIEW)
  return (
    <div className="lt-branch-list">
      {items.map(branch => {
        const isFile = branch.inputType === 'file'
        return (
          <a
            key={branch.idx}
            href={isFile ? undefined : (branch.url || '#')}
            target={isFile ? undefined : '_blank'}
            rel="noopener noreferrer"
            className="lt-branch-card"
            style={{ '--branch-color': color } as React.CSSProperties}
            onClick={isFile ? e => e.preventDefault() : undefined}
          >
            <span className="lt-branch-card__label">{branch.label}</span>
          </a>
        )
      })}
    </div>
  )
}

/* ── API 링크 버튼 (가지치기 포함) ── */
function LinkItem({
  link,
  isExpanded,
  onToggle,
}: {
  link: ApiLink
  isExpanded: boolean
  onToggle: () => void
}) {
  const meta = LINK_TYPE_META[link.linkType as keyof typeof LINK_TYPE_META]
  const icon = meta?.icon ?? '🔗'
  const color = meta?.color ?? '#7c3aed'
  const label = link.label || meta?.label || link.linkType
  const isFile = link.portfolioInputType === 'file'
  const hasBranch = link.hasBranch && link.branches.length > 0

  if (hasBranch) {
    return (
      <div className="lt-branch-group">
        <button
          className={`lt-link-btn lt-link-btn--toggle${isExpanded ? ' lt-link-btn--open' : ''}`}
          style={{ '--btn-color': color } as React.CSSProperties}
          onClick={onToggle}
        >
          <span className="lt-link-btn__icon">{icon}</span>
          <span className="lt-link-btn__label">{label}</span>
          <span className="lt-link-btn__arrow lt-link-btn__arrow--caret">
            {isExpanded ? '▲' : '▼'}
          </span>
        </button>
        {isExpanded && <BranchList branches={link.branches} color={color} />}
      </div>
    )
  }

  return (
    <a
      href={isFile ? undefined : (link.url || '#')}
      target={isFile ? undefined : '_blank'}
      rel="noopener noreferrer"
      className={`lt-link-btn${isFile ? ' lt-link-btn--disabled' : ''}`}
      style={{ '--btn-color': color } as React.CSSProperties}
      onClick={isFile ? e => e.preventDefault() : undefined}
    >
      <span className="lt-link-btn__icon">{icon}</span>
      <span className="lt-link-btn__label">{label}</span>
      <span className="lt-link-btn__arrow">{isFile ? '📁' : '↗'}</span>
    </a>
  )
}

/* ── 메인 페이지 ── */
function LinktreePage() {
  const { userId = 'demo' } = useParams<{ userId: string }>()
  const [apiProfile, setApiProfile] = useState<PublicProfile | null>(null)
  const [myLoginId, setMyLoginId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  // 현재 펼쳐진 가지치기 링크 idx (하나만 열 수 있음)
  const [expandedLinkIdx, setExpandedLinkIdx] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/members/me', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : null))
      .then(data => { if (data) setMyLoginId(data.id) })
  }, [])

  useEffect(() => {
    if (userId === 'demo') { setLoading(false); return }
    fetch(`/api/public/${userId}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => { setApiProfile(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [userId])

  if (loading) return null

  const isMyPage = myLoginId === userId

  const handleMyLinkUp = () => {
    window.location.href = myLoginId ? `/${myLoginId}` : '/'
  }

  const toggleBranch = (idx: number) => {
    setExpandedLinkIdx(prev => (prev === idx ? null : idx))
  }

  /* ── 데모 모드 ── */
  if (!apiProfile) {
    return (
      <div className="lt-wrapper" style={{ '--theme': DEMO.themeColor } as React.CSSProperties}>
        <div className="lt-bg-gradient" />
        <div className="lt-topbar">
          <button className="lt-my-btn" onClick={handleMyLinkUp}>🌿 내 LinkUP</button>
        </div>
        <main className="lt-main">
          <section className="lt-profile">
            <div className="lt-avatar">{DEMO.avatarEmoji}</div>
            <h1 className="lt-display-name">{DEMO.displayName}</h1>
            <p className="lt-username">{DEMO.username}</p>
            <p className="lt-bio">{DEMO.bio}</p>
            {isMyPage && <a href="/register" className="lt-manage-btn">✏️ 내 링크업 관리</a>}
          </section>
          <section className="lt-links">
            {DEMO.links.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="lt-link-btn"
                style={{ '--btn-color': link.color } as React.CSSProperties}
              >
                <span className="lt-link-btn__icon">{link.icon}</span>
                <span className="lt-link-btn__label">{link.label}</span>
                <span className="lt-link-btn__arrow">↗</span>
              </a>
            ))}
          </section>
          <footer className="lt-footer">
            <a href="/" className="lt-footer__brand">🌿 LinkUP으로 만들기</a>
          </footer>
        </main>
      </div>
    )
  }

  /* ── API 데이터 모드 ── */
  const bios = [apiProfile.bio1, apiProfile.bio2, apiProfile.bio3].filter(Boolean) as string[]
  const visibleLinks = apiProfile.links.filter(l => l.linkType !== 'none')

  return (
    <div className="lt-wrapper" style={{ '--theme': '#7c3aed' } as React.CSSProperties}>
      <div className="lt-bg-gradient" />
      <div className="lt-topbar">
        <button className="lt-my-btn" onClick={handleMyLinkUp}>🌿 내 LinkUP</button>
      </div>
      <main className="lt-main">
        <section className="lt-profile">
          <div className="lt-avatar">
            {apiProfile.photoPath
              ? <img
                  src={`/uploads/${apiProfile.photoPath.replace(/\\/g, '/').split('/uploads/')[1] ?? ''}`}
                  alt="프로필"
                  className="lt-avatar-img"
                />
              : '👤'}
          </div>
          <h1 className="lt-display-name">{apiProfile.loginId}</h1>
          <p className="lt-username">@{apiProfile.loginId}</p>
          {bios.length > 0 && (
            <div className="lt-bio">
              {bios.map((bio, i) => <p key={i}>{bio}</p>)}
            </div>
          )}
          {isMyPage && <a href="/register" className="lt-manage-btn">✏️ 내 링크업 관리</a>}
        </section>

        <section className="lt-links">
          {visibleLinks.map(link => (
            <LinkItem
              key={link.idx}
              link={link}
              isExpanded={expandedLinkIdx === link.idx}
              onToggle={() => toggleBranch(link.idx)}
            />
          ))}
        </section>

        <footer className="lt-footer">
          <a href="/" className="lt-footer__brand">🌿 LinkUP으로 만들기</a>
        </footer>
      </main>
    </div>
  )
}

export default LinktreePage
