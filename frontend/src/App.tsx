/* 앱 진입점: URL의 ?id 쿼리 파라미터 유무에 따라 페이지 분기 */
import LandingPage from './pages/LandingPage'
import LinktreePage from './pages/LinktreePage'

function App() {
  // ?id=*** 쿼리 파라미터 추출
  const params = new URLSearchParams(window.location.search)
  const userId = params.get('id')

  // id가 있으면 링크트리 프로필 페이지, 없으면 랜딩 페이지
  if (userId) {
    return <LinktreePage userId={userId} />
  }

  return <LandingPage />
}

export default App
