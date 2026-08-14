/* 회원가입 모달: 아이디/비번/비번확인/이메일/전화번호(3칸 자동포커스) */
import { useState, useEffect, useRef } from 'react'
import type { SignUpForm } from '../types/auth'
import './LoginModal.css'
import './SignUpModal.css'

interface SignUpModalProps {
  onClose: () => void
  onSwitchToLogin: () => void
}

type FormErrors = Partial<Record<keyof SignUpForm | 'server', string>>

function SignUpModal({ onClose, onSwitchToLogin }: SignUpModalProps) {
  const [form, setForm] = useState<SignUpForm>({
    id: '',
    password: '',
    passwordConfirm: '',
    email: '',
    phone1: '010',
    phone2: '',
    phone3: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const phone2Ref = useRef<HTMLInputElement>(null)
  const phone3Ref = useRef<HTMLInputElement>(null)

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'phone1' || name === 'phone2' || name === 'phone3') {
      const digits = value.replace(/\D/g, '')
      setForm(prev => ({ ...prev, [name]: digits }))
      if (name === 'phone1' && digits.length === 3) phone2Ref.current?.focus()
      if (name === 'phone2' && digits.length === 4) phone3Ref.current?.focus()
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }

    if (errors[name as keyof SignUpForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!form.id.trim()) newErrors.id = '아이디를 입력해주세요.'
    else if (form.id.length > 20) newErrors.id = '아이디는 최대 20자까지 가능합니다.'

    const pwRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]/;']).{8,}$/
    if (!form.password) newErrors.password = '비밀번호를 입력해주세요.'
    else if (!pwRegex.test(form.password)) newErrors.password = '8자 이상, 특수문자를 1개 이상 포함해야 합니다.'

    if (!form.passwordConfirm) newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.'
    else if (form.password !== form.passwordConfirm) newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email.trim()) newErrors.email = '이메일을 입력해주세요.'
    else if (!emailRegex.test(form.email)) newErrors.email = '이메일 형식이 올바르지 않습니다.'

    if (!form.phone2 || !form.phone3) newErrors.phone2 = '휴대폰 번호를 모두 입력해주세요.'
    else if (form.phone2.length < 3 || form.phone3.length < 4) newErrors.phone2 = '휴대폰 번호를 올바르게 입력해주세요.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setErrors({})

    const phone = `${form.phone1}-${form.phone2}-${form.phone3}`

    try {
      const res = await fetch('/api/members/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: form.id,
          password: form.password,
          email: form.email,
          phone,
        }),
      })

      if (res.ok) {
        // 가입 성공 → 로그인 모달로 전환
        onSwitchToLogin()
      } else {
        const data = await res.json()
        // 서버 필드별 검증 실패 메시지 처리
        if (data.errors?.length > 0) {
          const fieldErrors: FormErrors = {}
          for (const fe of data.errors) {
            fieldErrors[fe.field as keyof SignUpForm] = fe.reason
          }
          setErrors(fieldErrors)
        } else {
          setErrors({ server: data.message ?? '회원가입에 실패했습니다.' })
        }
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

        <h2 className="modal-title">회원가입</h2>
        <p className="modal-subtitle">나만의 링크트리를 지금 만들어보세요</p>

        <form onSubmit={handleSubmit} noValidate>
          {errors.server && (
            <div className="form-server-error">{errors.server}</div>
          )}

          {/* 아이디 */}
          <div className="form-group">
            <label className="form-label" htmlFor="signup-id">아이디</label>
            <input
              id="signup-id"
              className={`form-input ${errors.id ? 'error' : ''}`}
              type="text"
              name="id"
              value={form.id}
              onChange={handleChange}
              placeholder="아이디 (최대 20자)"
              autoComplete="username"
              autoFocus
            />
            {errors.id && <span className="form-error">{errors.id}</span>}
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <label className="form-label" htmlFor="signup-pw">비밀번호</label>
            <input
              id="signup-pw"
              className={`form-input ${errors.password ? 'error' : ''}`}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호"
              autoComplete="new-password"
            />
            <span className="pw-hint">8자 이상, 특수문자 1개 이상 포함</span>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-group">
            <label className="form-label" htmlFor="signup-pw-confirm">비밀번호 확인</label>
            <input
              id="signup-pw-confirm"
              className={`form-input ${errors.passwordConfirm ? 'error' : ''}`}
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
            />
            {errors.passwordConfirm && <span className="form-error">{errors.passwordConfirm}</span>}
          </div>

          {/* 이메일 */}
          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">이메일</label>
            <input
              id="signup-email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* 휴대폰 번호 */}
          <div className="form-group">
            <label className="form-label">휴대폰 번호</label>
            <div className="phone-row">
              <input
                className="form-input"
                type="text"
                name="phone1"
                value={form.phone1}
                onChange={handleChange}
                maxLength={3}
                inputMode="numeric"
                aria-label="휴대폰 앞자리"
              />
              <span className="phone-separator">-</span>
              <input
                ref={phone2Ref}
                className={`form-input ${errors.phone2 ? 'error' : ''}`}
                type="text"
                name="phone2"
                value={form.phone2}
                onChange={handleChange}
                maxLength={4}
                inputMode="numeric"
                placeholder="0000"
                aria-label="휴대폰 중간자리"
              />
              <span className="phone-separator">-</span>
              <input
                ref={phone3Ref}
                className={`form-input ${errors.phone2 ? 'error' : ''}`}
                type="text"
                name="phone3"
                value={form.phone3}
                onChange={handleChange}
                maxLength={4}
                inputMode="numeric"
                placeholder="0000"
                aria-label="휴대폰 끝자리"
              />
            </div>
            {errors.phone2 && <span className="form-error">{errors.phone2}</span>}
          </div>

          <button type="submit" className="modal-submit-btn" disabled={isLoading}>
            {isLoading ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <div className="modal-switch">
          이미 계정이 있으신가요?
          <button type="button" onClick={onSwitchToLogin}>로그인</button>
        </div>
      </div>
    </div>
  )
}

export default SignUpModal
