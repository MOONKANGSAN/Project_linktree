/* 시작 유도 랜딩 페이지: ?id 쿼리 없을 때 노출 */
import { useState, useEffect } from 'react'
import type { ModalType } from '../types/auth'
import LoginModal from '../components/LoginModal'
import SignUpModal from '../components/SignUpModal'
import './LandingPage.css'

function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginUserId, setLoginUserId] = useState('')
  const [modal, setModal] = useState<ModalType>(null)
  // 모바일 전용: 프로필 버튼 클릭 시 열리는 인증 선택 메뉴
  const [mobileAuthMenu, setMobileAuthMenu] = useState(false)

  // 마운트 시 기존 세션 확인 — 세션이 살아있으면 로그인 상태 자동 복원
  useEffect(() => {
    fetch('/api/members/me', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data) {
          setIsLoggedIn(true)
          setLoginUserId(data.id)
        }
      })
  }, [])

  const goToMyLinkUp = () => {
    window.location.href = `/${loginUserId}`
  }

  const openModal = (type: ModalType) => {
    setMobileAuthMenu(false)
    setModal(type)
  }

  return (
    <div className="landing-wrapper">

      {/* ── 데스크탑 전용 네비게이션 버튼 ── */}
      <nav id="desktop-nav" className="top-nav">
        {isLoggedIn ? (
          <>
            <button className="nav-btn" onClick={goToMyLinkUp}>
              <span className="nav-btn__label">내 LinkUP</span>
            </button>
            <button className="nav-btn" onClick={() => setIsLoggedIn(false)}>
              <span className="nav-btn__label">로그아웃</span>
            </button>
          </>
        ) : (
          <>
            <button className="nav-btn" onClick={() => setModal('login')}>
              <span className="nav-btn__label">로그인</span>
            </button>
            <button className="nav-btn" onClick={() => setModal('signup')}>
              <span className="nav-btn__label">회원가입</span>
            </button>
          </>
        )}
      </nav>

      {/* ── 모바일 전용 원형 프로필 버튼 ── */}
      <button
        id="mobile-profile-btn"
        className={`mobile-profile-btn${isLoggedIn ? ' mobile-profile-btn--logged-in' : ''}`}
        onClick={() => setMobileAuthMenu(true)}
        aria-label="계정 메뉴"
      >
        👤
      </button>

      {/* 모바일 인증 선택 모달 */}
      {mobileAuthMenu && (
        <div className="auth-menu-overlay" onClick={() => setMobileAuthMenu(false)}>
          <div className="auth-menu-card" onClick={e => e.stopPropagation()}>
            <button className="auth-menu-close" onClick={() => setMobileAuthMenu(false)}>✕</button>
            {isLoggedIn ? (
              <>
                <p className="auth-menu-title">계정 메뉴</p>
                <button className="auth-menu-btn" onClick={() => { setMobileAuthMenu(false); goToMyLinkUp() }}>
                  <span className="auth-menu-btn__icon">🔗</span>
                  <span>내 LinkUP</span>
                </button>
                <button className="auth-menu-btn auth-menu-btn--secondary"
                  onClick={() => { setMobileAuthMenu(false); setIsLoggedIn(false) }}>
                  <span className="auth-menu-btn__icon">🚪</span>
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <>
                <p className="auth-menu-title">시작하기</p>
                <button className="auth-menu-btn" onClick={() => openModal('login')}>
                  <span className="auth-menu-btn__icon">👤</span>
                  <span>로그인</span>
                </button>
                <button className="auth-menu-btn auth-menu-btn--secondary"
                  onClick={() => openModal('signup')}>
                  <span className="auth-menu-btn__icon">✏️</span>
                  <span>회원가입</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 배경 장식 원 */}
      <div className="landing-blob landing-blob--top" />
      <div className="landing-blob landing-blob--bottom" />

      <main className="landing-main">
        {/* 로고 영역 */}
        <div className="landing-logo">
          <span className="landing-logo__icon">🌿</span>
          <span className="landing-logo__text">
            Link<span className="landing-logo__up">UP</span>
          </span>
        </div>

        {/* 헤드라인 */}
        <h1 className="landing-headline">
          나만의 링크를<br />
          <span className="landing-headline--accent">한 곳에 모아</span>보세요
        </h1>
        <p className="landing-sub">
          LinkUP을 시작하세요! 프로필 하나로 모든 링크를 공유할 수 있습니다.
        </p>

        {/* CTA 버튼 */}
        <div className="landing-actions">
          <button className="btn btn--primary" onClick={() => setModal('signup')}>무료로 시작하기</button>
          <a className="btn btn--ghost" href="/demo">
            데모 보기 →
          </a>
        </div>

        {/* 기능 소개 카드 */}
        <div className="landing-features">
          <div className="feature-card">
            <span className="feature-card__icon">🔗</span>
            <h3>링크 모음</h3>
            <p>SNS, 블로그, 포트폴리오 등 모든 링크를 한 페이지에</p>
          </div>
          <div className="feature-card">
            <span className="feature-card__icon">✨</span>
            <h3>간편한 공유</h3>
            <p>URL 하나로 누구에게나 내 링크 전체를 공유</p>
          </div>
          <div className="feature-card">
            <span className="feature-card__icon">📊</span>
            <h3>클릭 통계</h3>
            <p>어떤 링크가 인기 있는지 한눈에 확인</p>
          </div>
        </div>
      </main>

      {/* 로그인 / 회원가입 모달 */}
      {modal === 'login' && (
        <LoginModal
          onClose={() => setModal(null)}
          onSwitchToSignUp={() => setModal('signup')}
          onLoginSuccess={(id) => { setIsLoggedIn(true); setLoginUserId(id) }}
        />
      )}
      {modal === 'signup' && (
        <SignUpModal
          onClose={() => setModal(null)}
          onSwitchToLogin={() => setModal('login')}
        />
      )}
    </div>
  )
}

export default LandingPage
