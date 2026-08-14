/* 링크트리 프로필 페이지: ?id=*** 쿼리 파라미터로 접근 시 노출 */
import type { LinktreePageProps } from '../types/linktree'
import { HARDCODED_USERS } from '../data/users'
import './LinktreePage.css'

function LinktreePage({ userId }: LinktreePageProps) {
  const profile = HARDCODED_USERS[userId]

  // 존재하지 않는 id인 경우 404 처리
  if (!profile) {
    return (
      <div className="lt-wrapper lt-wrapper--center">
        <div className="lt-not-found">
          <span className="lt-not-found__emoji">🔍</span>
          <h2>페이지를 찾을 수 없습니다</h2>
          <p>
            <strong>?id={userId}</strong> 에 해당하는 링크트리가 없어요.
          </p>
          <a href="/" className="lt-back-btn">← 홈으로 돌아가기</a>
        </div>
      </div>
    )
  }

  return (
    <div className="lt-wrapper" style={{ '--theme': profile.themeColor } as React.CSSProperties}>
      {/* 상단 배경 */}
      <div className="lt-bg-gradient" />

      <main className="lt-main">
        {/* 프로필 영역 */}
        <section className="lt-profile">
          <div className="lt-avatar">{profile.avatarEmoji}</div>
          <h1 className="lt-display-name">{profile.displayName}</h1>
          <p className="lt-username">{profile.username}</p>
          <p className="lt-bio">{profile.bio}</p>
        </section>

        {/* 링크 버튼 목록 */}
        <section className="lt-links">
          {profile.links.map((link) => (
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

        {/* 푸터 */}
        <footer className="lt-footer">
          <a href="/" className="lt-footer__brand">🌿 Linktree로 만들기</a>
        </footer>
      </main>
    </div>
  )
}

export default LinktreePage
