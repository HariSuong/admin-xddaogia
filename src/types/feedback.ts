export interface FeedbackInsert {
  name: string
  star: number
  content: string
  show: number
  url: string | null
  priority: number
  avatar: string | File | null // Nếu bạn muốn hỗ trợ việc upload file hình ảnh
  // thumb: string | File | null // Accept string for existing image URL
}

// Interface cho dữ liệu phân trang feedbacks
export interface FeedbackPagination {
  current_page: number
  data: Feedback[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: { url: string; label: string; active: boolean }[]
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

// Interface cho một feedback
export interface Feedback {
  id: number
  avatar: string
  name: string
  star: number
  content: string
  url: string | null
  show: number
  priority: number
  created_at: string
  updated_at: string
}

export interface FeedbackType {
  id: number
  name: string
  star: number
  content: string
  show: number
  avatar?: string // Thêm nếu cần thiết
  priority?: number // Thêm nếu cần thiết
}
