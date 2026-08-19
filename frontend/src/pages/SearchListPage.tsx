/* 검색 결과 리스트 페이지: /search_list?keyword=xxx 경로로 접근 시 노출 */
/* 메인 페이지 검색창(아이디/닉네임 입력)에서 넘어오며, 이 페이지 진입 시 keyword로 백엔드에 AJAX 조회를 수행함 */
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import type { SearchResultItem } from '../types/linktree'
import './SearchListPage.css'

function SearchListPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const keyword = searchParams.get('keyword')?.trim() ?? ''

  const [inputValue, setInputValue] = useState(keyword)
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // URL의 keyword가 바뀔 때마다 AJAX(fetch)로 백엔드에 아이디/닉네임 검색 요청
  // 백엔드(GET /api/public/search)는 member.id / profile.nickname을 SQL로 조회해 결과를 반환함
  useEffect(() => {
    setInputValue(keyword)

    if (!keyword) {
      setResults([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(false)

    fetch(`/api/public/search?keyword=${encodeURIComponent(keyword)}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('검색 요청 실패')
        return res.json() as Promise<SearchResultItem[]>
      })
      .then(data => {
        if (!cancelled) setResults(data)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [keyword])

  // 결과 페이지 상단 검색창에서 재검색 — 메인 페이지와 동일한 규칙(URL 직행 / 아이디·닉네임 검색) 적용
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = inputValue.trim()
    if (!q) return

    if (/^https?:\/\//i.test(q)) {
      window.location.href = q
      return
    }

    navigate(`/search_list?keyword=${encodeURIComponent(q)}`)
  }

  return (
    <div className="search-list-wrapper">
      <a href="/" className="search-list-logo">
        🌿 Link<span className="search-list-logo__up">UP</span>
      </a>

      <form className="search-list-form" onSubmit={handleSearch} noValidate>
        <input
          className="search-list-input"
          type="text"
          placeholder="사용자 닉네임 혹은 아이디를 입력해보세요!"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button type="submit" className="search-list-btn">검색</button>
      </form>

      <main className="search-list-main">
        {loading && <p className="search-list-status">검색 중...</p>}

        {!loading && error && (
          <p className="search-list-status">검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
        )}

        {!loading && !error && !keyword && (
          <p className="search-list-status">검색어를 입력해주세요.</p>
        )}

        {!loading && !error && keyword && results.length === 0 && (
          <p className="search-list-status">'{keyword}'에 대한 검색 결과가 없습니다.</p>
        )}

        {!loading && !error && results.length > 0 && (
          <ul className="search-list-results">
            {results.map(item => (
              <li key={item.loginId}>
                <a className="search-result-card" href={`/${item.loginId}`}>
                  <div className="search-result-avatar">
                    {item.photoPath
                      ? (
                        <img
                          src={`/uploads/${item.photoPath.replace(/\\/g, '/').split('/uploads/')[1] ?? ''}`}
                          alt="프로필"
                        />
                      )
                      : '👤'}
                  </div>
                  <div className="search-result-info">
                    <p className="search-result-name">{item.nickname || item.loginId}</p>
                    <p className="search-result-id">@{item.loginId}</p>
                    {item.bio1 && <p className="search-result-bio">{item.bio1}</p>}
                  </div>
                  <span className="search-result-arrow">↗</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

export default SearchListPage
