/* 인증 관련 폼 타입 정의 */

export interface LoginForm {
  id: string
  password: string
  saveId: boolean
}

export interface SignUpForm {
  id: string
  password: string
  passwordConfirm: string
  email: string
  phone1: string  // 010
  phone2: string  // 1234
  phone3: string  // 5678
}

export type ModalType = 'login' | 'signup' | null
