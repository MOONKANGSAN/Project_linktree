/* 링크업 등록/수정 페이지
 * - 로그인 후 기존 데이터가 있으면 수정 모드, 없으면 신규 등록 모드로 자동 분기
 */
import { useState, useEffect } from 'react'
import type { LinkFormItem, BranchItem, LinkType, PortfolioInputType, ProfileForm } from '../types/link'
import {
  MAX_LINKS, uid, emptyLink,
  LinkCard, ProfileSection,
} from '../components/LinkFormParts'
import './LinkRegisterPage.css'

// 백엔드 응답 링크 → 폼 상태 변환
function apiLinksToFormItems(apiLinks: any[]): LinkFormItem[] {
  return apiLinks.map(link => ({
    id: uid(),
    type: (link.linkType ?? 'none') as LinkType,
    label: link.label ?? '',
    url: link.portfolioInputType === 'file' ? '' : (link.url ?? ''),
    portfolioInputType: (link.portfolioInputType ?? 'url') as PortfolioInputType,
    portfolioFile: null,
    existingFilePath: link.filePath ?? null,
    hasBranch: link.hasBranch ?? false,
    branches: (link.branches ?? []).map((br: any): BranchItem => ({
      id: uid(),
      label: br.label ?? '',
      url: br.inputType === 'file' ? '' : (br.url ?? ''),
      inputType: (br.inputType ?? 'url') as PortfolioInputType,
      file: null,
      existingFilePath: br.filePath ?? null,
    })),
  }))
}

// 서버 파일 경로 → 브라우저 미리보기 URL 변환
function photoPathToPreviewUrl(photoPath: string | null): string {
  if (!photoPath) return ''
  const part = photoPath.replace(/\\/g, '/').split('/uploads/')[1]
  return part ? `/uploads/${part}` : ''
}

function LinkRegisterPage() {
  const [profile, setProfile] = useState<ProfileForm>({
    photo: null, photoPreview: '', visibility: 2, nickname: '', bios: [''],
  })
  const [links, setLinks] = useState<LinkFormItem[]>([emptyLink(), emptyLink()])
  // true: 기존 데이터 있음(수정 모드) / false: 신규 등록 모드
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(true)

  // 마운트 시: 로그인 체크 + 기존 데이터 로드
  useEffect(() => {
    Promise.all([
      fetch('/api/members/me', { credentials: 'include' }),
      fetch('/api/profile/me', { credentials: 'include' }),
      fetch('/api/links/me', { credentials: 'include' }),
    ]).then(async ([authRes, profileRes, linksRes]) => {
      // 미로그인 → 랜딩으로
      if (authRes.status === 401) {
        alert('로그인이 필요한 서비스입니다.')
        window.location.href = '/'
        return
      }

      let hasExistingData = false

      // 기존 프로필 데이터 세팅
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        const bios = [profileData.bio1, profileData.bio2, profileData.bio3]
          .filter(Boolean) as string[]
        if (bios.length > 0 || profileData.photoPath || profileData.nickname) {
          hasExistingData = true
          setProfile({
            photo: null,
            photoPreview: photoPathToPreviewUrl(profileData.photoPath),
            visibility: profileData.visibility ?? 2,
            nickname: profileData.nickname ?? '',
            bios: bios.length > 0 ? bios : [''],
          })
        }
      }

      // 기존 링크 데이터 세팅
      if (linksRes.ok) {
        const linksData = await linksRes.json()
        if (linksData.length > 0) {
          hasExistingData = true
          setLinks(apiLinksToFormItems(linksData))
        }
      }

      setIsEditMode(hasExistingData)
      setLoading(false)
    }).catch(() => {
      alert('데이터를 불러오는 중 오류가 발생했습니다.')
      setLoading(false)
    })
  }, [])

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

  const handleUnauthorized = () => {
    alert('로그인 세션이 만료되었습니다. 다시 로그인해 주세요.')
    window.location.href = '/'
  }

  // 파일 업로드 응답 공통 처리 (401 / 413 / 기타 오류)
  const checkFileRes = (res: Response, label: string): boolean => {
    if (res.status === 401) { handleUnauthorized(); return false }
    if (res.status === 413) {
      throw new Error(`${label} 파일이 너무 큽니다. 최대 20MB까지 업로드 가능합니다.`)
    }
    if (!res.ok) throw new Error(`${label} 파일 업로드 실패 (${res.status})`)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // 1) 공개여부 + 닉네임 + 소개글 저장
      const profileRes = await fetch('/api/profile/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          visibility: profile.visibility,
          nickname: profile.nickname || null,
          bio1: profile.bios[0] ?? null,
          bio2: profile.bios[1] ?? null,
          bio3: profile.bios[2] ?? null,
        }),
      })
      if (profileRes.status === 401) { handleUnauthorized(); return }
      if (!profileRes.ok) throw new Error('프로필 저장 실패')

      // 2) 프로필 사진 — 새 파일 선택 시에만 업로드
      if (profile.photo) {
        const formData = new FormData()
        formData.append('file', profile.photo)
        const photoRes = await fetch('/api/profile/me/photo', {
          method: 'POST', credentials: 'include', body: formData,
        })
        if (photoRes.status === 401) { handleUnauthorized(); return }
        if (!photoRes.ok) throw new Error('사진 업로드 실패')
      }

      // 3) 링크 저장
      // 수정 모드: 새 파일 미선택 시 existingFilePath로 기존 경로 유지
      // 등록 모드: existingFilePath는 항상 null
      const linkPayload = links.map(l => ({
        linkType: l.type,
        label: l.label,
        url: (l.type === 'portfolio' && l.portfolioInputType === 'file') ? '' : l.url,
        portfolioInputType: l.type === 'portfolio' ? l.portfolioInputType : null,
        existingFilePath: l.portfolioFile ? null : (l.existingFilePath ?? null),
        hasBranch: l.hasBranch,
        branches: l.hasBranch ? l.branches.map(b => ({
          label: b.label,
          url: b.inputType === 'url' ? b.url : '',
          inputType: b.inputType,
          existingFilePath: b.file ? null : (b.existingFilePath ?? null),
        })) : [],
      }))

      const linkRes = await fetch('/api/links/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(linkPayload),
      })
      if (linkRes.status === 401) { handleUnauthorized(); return }
      if (!linkRes.ok) throw new Error('링크 저장 실패')
      const savedLinks = await linkRes.json()

      // 4) 새로 선택한 파일만 업로드
      for (let i = 0; i < links.length; i++) {
        const link = links[i]
        if (link.type === 'portfolio' && link.portfolioInputType === 'file' && link.portfolioFile) {
          const fd = new FormData()
          fd.append('file', link.portfolioFile)
          const fileRes = await fetch(`/api/links/${savedLinks[i].idx}/file`, {
            method: 'POST', credentials: 'include', body: fd,
          })
          if (!checkFileRes(fileRes, '포트폴리오')) return
        }
        if (link.hasBranch && savedLinks[i]?.branches) {
          for (let j = 0; j < link.branches.length; j++) {
            const branch = link.branches[j]
            if (branch.inputType === 'file' && branch.file && savedLinks[i].branches[j]) {
              const fd = new FormData()
              fd.append('file', branch.file)
              const branchFileRes = await fetch(
                `/api/links/branches/${savedLinks[i].branches[j].idx}/file`,
                { method: 'POST', credentials: 'include', body: fd }
              )
              if (!checkFileRes(branchFileRes, '가지치기')) return
            }
          }
        }
      }

      alert(isEditMode ? '수정이 완료되었습니다!' : '저장이 완료되었습니다!')
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.')
      console.error(err)
    }
  }

  if (loading) return null

  return (
    <div className="register-wrapper">
      <header className="register-header">
        <a href="/" className="register-header__back">← 돌아가기</a>
        <h1 className="register-header__title">
          Link<span className="register-header__up">UP</span>{' '}
          {isEditMode ? '수정' : '등록'}
        </h1>
      </header>

      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <ProfileSection form={profile} onChange={updateProfile} />

        <h2 className="section-title">
          {isEditMode ? '링크 수정' : '링크 등록'}
        </h2>
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

        <button type="submit" className="register-submit-btn">
          {isEditMode ? '수정 완료' : '저장하기'}
        </button>
      </form>
    </div>
  )
}

export default LinkRegisterPage
