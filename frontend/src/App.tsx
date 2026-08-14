/* 앱 진입점: URL 파라미터에 따라 페이지 분기 */
import LandingPage from './pages/LandingPage'
import LinktreePage from './pages/LinktreePage'
import LinkRegisterPage from './pages/LinkRegisterPage'

function App() {
  const params = new URLSearchParams(window.location.search)
  const userId = params.get('id')
  const isRegister = params.has('register')

  // ?register → 링크 등록 페이지
  if (isRegister) return <LinkRegisterPage />

  // ?id=xxx → 링크업 뷰어 페이지
  if (userId) return <LinktreePage userId={userId} />

  // 기본 → 랜딩 페이지
  return <LandingPage />
}

export default App
