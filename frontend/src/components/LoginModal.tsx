/* 로그인 모달: 아이디/비밀번호 입력 + 아이디 저장 기능 */
import { useState, useEffect } from 'react'
import type { LoginForm } from '../types/auth'
import './LoginModal.css'

const SAVED_ID_KEY = 'linktree_saved_id'

interface LoginModalProps {
  onClose: () => void
  onSwitchToSignUp: () => void
  onLoginSuccess: (memberId: string) => void
}

function LoginModal({ onClose, onSwitchToSignUp, onLoginSuccess }: LoginModalProps) {
  const [form, setForm] = useState<LoginForm>({
    id: '',
    password: '',
    saveId: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm | 'server', string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  // 컴포넌트 마운트 시 저장된 아이디 자동 입력
  useEffect(() => {
    const savedId = localStorage.getItem(SAVED_ID_KEY)
    if (savedId) {
      setForm(prev => ({ ...prev, id: savedId, saveId: true }))
    }
  }, [])

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name as keyof LoginForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LoginForm, string>> = {}
    if (!form.id.trim()) newErrors.id = '아이디를 입력해주세요.'
    if (!form.password.trim()) newErrors.password = '비밀번호를 입력해주세요.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setErrors({})

    try {
      const res = await fetch('/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 세션 쿠키를 브라우저가 자동으로 주고받도록 설정
        credentials: 'include',
        body: JSON.stringify({ id: form.id, password: form.password }),
      })

      if (res.ok) {
        // 아이디 저장 처리
        if (form.saveId) {
          localStorage.setItem(SAVED_ID_KEY, form.id)
        } else {
          localStorage.removeItem(SAVED_ID_KEY)
        }
        onLoginSuccess(form.id)
        onClose()
      } else {
        const data = await res.json()
        setErrors({ server: data.message ?? '로그인에 실패했습니다.' })
      }
    } catch {
      setErrors({ server: '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="닫기">✕</button>

        <h2 className="modal-title">로그인</h2>
        <p className="modal-subtitle">링크트리에 오신 것을 환영합니다</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* 서버 에러 메시지 */}
          {errors.server && (
            <div className="form-server-error">{errors.server}</div>
          )}

          {/* 아이디 */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-id">아이디</label>
            <input
              id="login-id"
              className={`form-input ${errors.id ? 'error' : ''}`}
              type="text"
              name="id"
              value={form.id}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              autoComplete="username"
              autoFocus
            />
            {errors.id && <span className="form-error">{errors.id}</span>}
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-pw">비밀번호</label>
            <input
              id="login-pw"
              className={`form-input ${errors.password ? 'error' : ''}`}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* 아이디 저장 */}
          <div className="login-save-row">
            <input
              id="save-id"
              type="checkbox"
              name="saveId"
              checked={form.saveId}
              onChange={handleChange}
            />
            <label htmlFor="save-id">아이디 저장</label>
          </div>

          <button type="submit" className="modal-submit-btn" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="modal-switch">
          아직 계정이 없으신가요?
          <button type="button" onClick={onSwitchToSignUp}>회원가입</button>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
