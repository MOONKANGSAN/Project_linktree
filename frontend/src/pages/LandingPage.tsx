/* 시작 유도 랜딩 페이지: ?id 쿼리 없을 때 노출 */
import { useState } from 'react'
import type { ModalType } from '../types/auth'
import LoginModal from '../components/LoginModal'
import SignUpModal from '../components/SignUpModal'
import './LandingPage.css'

function LandingPage() {
  // 임시 로그인 상태 (실제 인증 연동 전 테스트용)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // 현재 열린 모달 ('login' | 'signup' | null)
  const [modal, setModal] = useState<ModalType>(null)

  return (
    <div className="landing-wrapper">
      {/* 우측 상단 네비게이션 버튼 */}
      <nav className="top-nav">
        {isLoggedIn ? (
          <>
            <button className="nav-btn">내 링크트리</button>
            <button className="nav-btn" onClick={() => setIsLoggedIn(false)}>로그아웃</button>
          </>
        ) : (
          <>
            <button className="nav-btn" onClick={() => setModal('login')}>로그인</button>
            <button className="nav-btn" onClick={() => setModal('signup')}>회원가입</button>
          </>
        )}
      </nav>

      {/* 배경 그라디언트 장식 원 */}
      <div className="landing-blob landing-blob--top" />
      <div className="landing-blob landing-blob--bottom" />

      <main className="landing-main">
        {/* 로고 영역 */}
        <div className="landing-logo">
          <span className="landing-logo__icon">🌿</span>
          <span className="landing-logo__text">Linktree</span>
        </div>

        {/* 헤드라인 */}
        <h1 className="landing-headline">
          나만의 링크를<br />
          <span className="landing-headline--accent">한 곳에 모아</span>보세요
        </h1>
        <p className="landing-sub">
          링크트리를 시작하세요! 프로필 하나로 모든 링크를 공유할 수 있습니다.
        </p>

        {/* CTA 버튼 */}
        <div className="landing-actions">
          <button className="btn btn--primary" onClick={() => setModal('signup')}>무료로 시작하기</button>
          <a className="btn btn--ghost" href="?id=demo">
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

      {/* 모달 렌더링 */}
      {modal === 'login' && (
        <LoginModal
          onClose={() => setModal(null)}
          onSwitchToSignUp={() => setModal('signup')}
          onLoginSuccess={() => setIsLoggedIn(true)}
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
