/* 링크업 등록 페이지 */
import { useState, useRef } from 'react'
import type { LinkFormItem, BranchItem, LinkType, PortfolioInputType, ProfileForm } from '../types/link'
import { LINK_TYPE_META, LINK_TYPES } from '../data/linkTypes'
import './LinkRegisterPage.css'

const MAX_LINKS = 10
const MAX_BRANCHES = 5
const MAX_BIOS = 3

const uid = () => Math.random().toString(36).slice(2)

const emptyLink = (): LinkFormItem => ({
  id: uid(), type: 'none', label: '', url: '',
  portfolioInputType: 'url', portfolioFile: null,
  hasBranch: false, branches: [],
})

const emptyBranch = (): BranchItem => ({
  id: uid(), label: '', url: '', inputType: 'url', file: null,
})

/* ── URL + 파일 토글 입력 ── */
interface UrlFileInputProps {
  inputType: PortfolioInputType
  url: string
  file: File | null
  placeholder: string
  onChangeUrl: (v: string) => void
  onChangeFile: (f: File | null) => void
  onToggle: () => void
}

function UrlFileInput({ inputType, url, file, placeholder, onChangeUrl, onChangeFile, onToggle }: UrlFileInputProps) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="url-file-wrap">
      {inputType === 'url' ? (
        <input
          className="reg-input url-file-wrap__input"
          type="url"
          placeholder={placeholder}
          value={url}
          onChange={e => onChangeUrl(e.target.value)}
        />
      ) : (
        <div className="url-file-wrap__file" onClick={() => ref.current?.click()}>
          <span className="url-file-wrap__file-name">
            {file ? file.name : '파일을 선택하세요'}
          </span>
          <input
            ref={ref}
            type="file"
            accept=".pdf,.ppt,.pptx,.zip,.key"
            style={{ display: 'none' }}
            onChange={e => onChangeFile(e.target.files?.[0] ?? null)}
          />
        </div>
      )}
      <button type="button" className="url-file-wrap__toggle" onClick={onToggle} title={inputType === 'url' ? '파일로 전환' : 'URL로 전환'}>
        {inputType === 'url' ? '📎' : '🔗'}
      </button>
    </div>
  )
}

/* ── 가지치기 행 ── */
interface BranchRowProps {
  branch: BranchItem
  onChange: (u: Partial<BranchItem>) => void
  onRemove: () => void
}

function BranchRow({ branch, onChange, onRemove }: BranchRowProps) {
  return (
    <div className="branch-item">
      <input
        className="reg-input"
        type="text"
        placeholder="버튼 이름 (예: 백오피스)"
        value={branch.label}
        onChange={e => onChange({ label: e.target.value })}
      />
      <UrlFileInput
        inputType={branch.inputType}
        url={branch.url}
        file={branch.file}
        placeholder="URL"
        onChangeUrl={v => onChange({ url: v })}
        onChangeFile={f => onChange({ file: f })}
        onToggle={() => onChange({ inputType: branch.inputType === 'url' ? 'file' : 'url', url: '', file: null })}
      />
      <button type="button" className="branch-item__remove" onClick={onRemove}>✕</button>
    </div>
  )
}

/* ── 링크 카드 ── */
interface LinkCardProps {
  link: LinkFormItem
  index: number
  canRemove: boolean
  onChange: (u: Partial<LinkFormItem>) => void
  onRemove: () => void
}

function LinkCard({ link, index, canRemove, onChange, onRemove }: LinkCardProps) {
  const isPortfolio = link.type === 'portfolio'
  const meta = LINK_TYPE_META[link.type]
  const filledBranches = link.branches.filter(b => b.label.trim())

  const handleTypeChange = (type: LinkType) => {
    onChange({ type, url: '', portfolioFile: null, portfolioInputType: 'url', hasBranch: false, branches: [] })
  }

  const addBranch = () => {
    if (link.branches.length >= MAX_BRANCHES) return
    onChange({ branches: [...link.branches, emptyBranch()] })
  }

  const removeBranch = (id: string) =>
    onChange({ branches: link.branches.filter(b => b.id !== id) })

  const updateBranch = (id: string, updates: Partial<BranchItem>) =>
    onChange({ branches: link.branches.map(b => b.id === id ? { ...b, ...updates } : b) })

  return (
    <div className="link-card">
      {/* 헤더 */}
      <div className="link-card__header">
        <span className="link-card__num">링크 {index + 1}</span>
        {canRemove && (
          <button type="button" className="link-card__remove" onClick={onRemove}>삭제</button>
        )}
      </div>

      {/* 플랫폼 + 표시 이름 */}
      <div className="link-card__row">
        <div>
          <label className="reg-label">플랫폼</label>
          <select
            className="reg-select"
            value={link.type}
            onChange={e => handleTypeChange(e.target.value as LinkType)}
          >
            {LINK_TYPES.map(t => (
              <option key={t} value={t}>
                {LINK_TYPE_META[t].icon} {LINK_TYPE_META[t].label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="reg-label">표시 이름</label>
          <input
            className="reg-input"
            type="text"
            placeholder={link.type === 'none' ? '링크 이름' : `예: 내 ${meta.label}`}
            value={link.label}
            onChange={e => onChange({ label: e.target.value })}
          />
        </div>
      </div>

      {/* URL / 포트폴리오 입력 — 미정이면 숨김 */}
      {link.type !== 'none' && (
        <div className="link-card__url-row">
          <label className="reg-label">
            {isPortfolio ? '링크 / 파일' : 'URL'}
          </label>
          {isPortfolio ? (
            <UrlFileInput
              inputType={link.portfolioInputType}
              url={link.url}
              file={link.portfolioFile}
              placeholder={meta.placeholder}
              onChangeUrl={v => onChange({ url: v })}
              onChangeFile={f => onChange({ portfolioFile: f })}
              onToggle={() => onChange({
                portfolioInputType: link.portfolioInputType === 'url' ? 'file' : 'url',
                url: '', portfolioFile: null,
              })}
            />
          ) : (
            <input
              className="reg-input"
              type="url"
              placeholder={meta.placeholder}
              value={link.url}
              onChange={e => onChange({ url: e.target.value })}
            />
          )}
          {isPortfolio && (
            <p className="file-upload-hint">📎 아이콘 클릭 시 파일 업로드로 전환 · PDF, PPT, PPTX, ZIP, KEY 지원</p>
          )}
        </div>
      )}

      {/* 가지치기 — 포트폴리오 타입일 때만 표시 */}
      {isPortfolio && (
        <>
          <div className="branch-toggle-row">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={link.hasBranch}
                onChange={e => onChange({ hasBranch: e.target.checked, branches: [] })}
              />
              <span className="toggle-slider" />
            </label>
            <span className="branch-toggle-label">가지치기</span>
            {link.hasBranch && (
              <span className="branch-toggle-badge">{link.branches.length} / {MAX_BRANCHES}</span>
            )}
          </div>

          {link.hasBranch && (
            <>
              <div className="branch-list">
                {link.branches.map(branch => (
                  <BranchRow
                    key={branch.id}
                    branch={branch}
                    onChange={u => updateBranch(branch.id, u)}
                    onRemove={() => removeBranch(branch.id)}
                  />
                ))}
              </div>
              {link.branches.length < MAX_BRANCHES && (
                <button type="button" className="add-branch-btn" onClick={addBranch}>
                  + 가지 추가
                </button>
              )}
              {filledBranches.length > 0 && (
                <div className="branch-preview">
                  <p className="branch-preview__label">뷰어 미리보기</p>
                  <div className="branch-preview__chips">
                    {filledBranches.map(b => (
                      <span key={b.id} className="branch-preview__chip">{b.label}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

/* ── 프로필 섹션 ── */
interface ProfileSectionProps {
  form: ProfileForm
  onChange: (u: Partial<ProfileForm>) => void
}

function ProfileSection({ form, onChange }: ProfileSectionProps) {
  const photoRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    onChange({ photo: file, photoPreview: URL.createObjectURL(file) })
  }

  const addBio = () => {
    if (form.bios.length >= MAX_BIOS) return
    onChange({ bios: [...form.bios, ''] })
  }

  const removeBio = (i: number) =>
    onChange({ bios: form.bios.filter((_, idx) => idx !== i) })

  const updateBio = (i: number, v: string) =>
    onChange({ bios: form.bios.map((b, idx) => idx === i ? v : b) })

  return (
    <div className="profile-section">
      <h2 className="section-title">프로필</h2>

      {/* 사진 */}
      <div className="profile-photo-row">
        <div className="profile-photo-preview" onClick={() => photoRef.current?.click()}>
          {form.photoPreview
            ? <img src={form.photoPreview} alt="프로필 사진" />
            : <span className="profile-photo-placeholder">👤</span>}
          <div className="profile-photo-overlay">사진 변경</div>
        </div>
        <div className="profile-photo-info">
          <p className="profile-photo-hint">프로필 사진을 클릭하면 변경할 수 있습니다.</p>
          <p className="profile-photo-hint">JPG, PNG, WEBP 지원</p>
          {form.photo && (
            <button
              type="button"
              className="profile-photo-remove"
              onClick={() => onChange({ photo: null, photoPreview: '' })}
            >
              사진 제거
            </button>
          )}
        </div>
        <input
          ref={photoRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
      </div>

      {/* 소개글 */}
      <div className="bio-section">
        <label className="reg-label">내 소개글 <span className="bio-count">({form.bios.length}/{MAX_BIOS})</span></label>
        <div className="bio-list">
          {form.bios.map((bio, i) => (
            <div key={i} className="bio-row">
              <input
                className="reg-input"
                type="text"
                placeholder={`소개글 ${i + 1} (예: 풀스택 개발자)`}
                value={bio}
                maxLength={60}
                onChange={e => updateBio(i, e.target.value)}
              />
              {form.bios.length > 1 && (
                <button type="button" className="bio-remove" onClick={() => removeBio(i)}>✕</button>
              )}
            </div>
          ))}
        </div>
        {form.bios.length < MAX_BIOS && (
          <button type="button" className="add-bio-btn" onClick={addBio}>
            + 소개글 추가
          </button>
        )}
      </div>
    </div>
  )
}

/* ── 메인 페이지 ── */
function LinkRegisterPage() {
  const [profile, setProfile] = useState<ProfileForm>({
    photo: null,
    photoPreview: '',
    bios: [''],
  })
  const [links, setLinks] = useState<LinkFormItem[]>([emptyLink(), emptyLink()])

  const updateProfile = (updates: Partial<ProfileForm>) =>
    setProfile(prev => ({ ...prev, ...updates }))

  const addLink = () => {
    if (links.length >= MAX_LINKS) return
    setLinks(prev => [...prev, emptyLink()])
  }

  const removeLink = (id: string) =>
    setLinks(prev => prev.filter(l => l.id !== id))

  const updateLink = (id: string, updates: Partial<LinkFormItem>) =>
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // 1) 소개글 저장
      await fetch('/api/profile/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          bio1: profile.bios[0] ?? null,
          bio2: profile.bios[1] ?? null,
          bio3: profile.bios[2] ?? null,
        }),
      })

      // 2) 프로필 사진 업로드
      if (profile.photo) {
        const formData = new FormData()
        formData.append('file', profile.photo)
        await fetch('/api/profile/me/photo', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })
      }

      // 3) 링크 저장 (파일 미포함 JSON)
      const linkPayload = links.map(l => ({
        linkType: l.type,
        label: l.label,
        url: l.type === 'portfolio' && l.portfolioInputType === 'url' ? l.url : '',
        portfolioInputType: l.type === 'portfolio' ? l.portfolioInputType : null,
        hasBranch: l.hasBranch,
        branches: l.hasBranch ? l.branches.map(b => ({
          label: b.label,
          url: b.inputType === 'url' ? b.url : '',
          inputType: b.inputType,
        })) : [],
      }))

      const linkRes = await fetch('/api/links/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(linkPayload),
      })
      const savedLinks = await linkRes.json()

      // 4) 포트폴리오 파일 업로드
      for (let i = 0; i < links.length; i++) {
        const link = links[i]
        if (link.type === 'portfolio' && link.portfolioInputType === 'file' && link.portfolioFile) {
          const fd = new FormData()
          fd.append('file', link.portfolioFile)
          await fetch(`/api/links/${savedLinks[i].idx}/file`, {
            method: 'POST', credentials: 'include', body: fd,
          })
        }
        // 가지치기 파일 업로드
        if (link.hasBranch && savedLinks[i].branches) {
          for (let j = 0; j < link.branches.length; j++) {
            const branch = link.branches[j]
            if (branch.inputType === 'file' && branch.file) {
              const fd = new FormData()
              fd.append('file', branch.file)
              await fetch(`/api/links/branches/${savedLinks[i].branches[j].idx}/file`, {
                method: 'POST', credentials: 'include', body: fd,
              })
            }
          }
        }
      }

      alert('저장이 완료되었습니다!')
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.')
      console.error(err)
    }
  }

  return (
    <div className="register-wrapper">
      <header className="register-header">
        <a href="/" className="register-header__back">← 돌아가기</a>
        <h1 className="register-header__title">
          Link<span className="register-header__up">UP</span> 등록
        </h1>
      </header>

      <form className="register-form" onSubmit={handleSubmit} noValidate>
        {/* 프로필 영역 */}
        <ProfileSection form={profile} onChange={updateProfile} />

        {/* 링크 목록 */}
        <h2 className="section-title">링크 등록</h2>
        {links.map((link, index) => (
          <LinkCard
            key={link.id}
            link={link}
            index={index}
            canRemove={links.length > 1}
            onChange={u => updateLink(link.id, u)}
            onRemove={() => removeLink(link.id)}
          />
        ))}

        <div className="add-link-row">
          <span className="add-link-count">{links.length} / {MAX_LINKS} 링크 등록됨</span>
          <button
            type="button"
            className="add-link-btn"
            onClick={addLink}
            disabled={links.length >= MAX_LINKS}
          >
            + 링크 추가
          </button>
        </div>

        <button type="submit" className="register-submit-btn">저장하기</button>
      </form>
    </div>
  )
}

export default LinkRegisterPage
