/* 앱 진입점: React Router로 경로별 페이지 분기 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LinktreePage from './pages/LinktreePage'
import LinkRegisterPage from './pages/LinkRegisterPage'
import SearchListPage from './pages/SearchListPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<LinkRegisterPage />} />
        {/* 검색 결과 리스트 페이지 — /:userId 보다 먼저 선언해 리터럴 경로가 우선 매칭되도록 함 */}
        <Route path="/search_list" element={<SearchListPage />} />
        {/* /:userId → 공개 링크업 뷰어 페이지 (demo 포함) */}
        <Route path="/:userId" element={<LinktreePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
