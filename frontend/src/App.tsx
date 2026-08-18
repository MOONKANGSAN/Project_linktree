/* 앱 진입점: React Router로 경로별 페이지 분기 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LinktreePage from './pages/LinktreePage'
import LinkRegisterPage from './pages/LinkRegisterPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<LinkRegisterPage />} />
        {/* /:userId → 공개 링크업 뷰어 페이지 (demo 포함) */}
        <Route path="/:userId" element={<LinktreePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
