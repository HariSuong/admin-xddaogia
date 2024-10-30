// Interface cho dữ liệu phân trang slides
export interface SlidePagination {
  current_page: number
  data: Slide[]
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

// Interface cho một slide
export interface Slide {
  id: number
  image: string | null
  link: string | null
  target: string
  order: number
  show: number
  created_at: string
  updated_at: string
  title: string | null
  desc: string | null
}

// Interface cho dữ liệu slide insert
export interface SlideInsert {
  image: string | File | null // Nếu bạn muốn hỗ trợ việc upload file hình ảnh
  link: string
  target: string
  order: number
  show: number
  title: string | null
  desc: string | null
}

export interface SlideType {
  id: number
  show: number
  title: string | null
  desc: string | null
}
