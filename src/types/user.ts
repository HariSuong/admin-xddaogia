export interface User {
  id: number
  name?: string | null
  username?: string | null
  full_name?: string
  first_name?: string
  last_name?: string | null
  country?: string | null
  calling_code?: string | null
  birthday?: string | null
  gender?: string
  phone?: string | null
  phone_verified?: number
  email: string
  email_verified?: number
  password: string
  address?: string | null
  registered_at?: string | null
  updated_at?: string
  avatar?: string | null
  session_id?: string | null
  document_photos?: string | null
  admin?: number
  locked?: number
  desc?: string | null
  remember_token?: string | null
  created_at?: string
  otp?: string | null
}

export interface UserPagination {
  current_page: 1
  data: User[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: { url: string; label: string; active: boolean }[]
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: string
  to: number
  total: number
}

export interface UserType {
  id: number
  name: string | null | undefined
  email: string
  phone: string | null | undefined
}

export interface InsertUserType {
  name: string
  email: string
  phone: string | null
  password: string // Giả sử bạn có trường password khi thêm người dùng
}

export interface UserDetailDrawerProps {
  visible: boolean
  onClose: () => void
  user: {
    id: number
    name: string | null | undefined
    email: string
    phone: string | null | undefined
  } | null
}
