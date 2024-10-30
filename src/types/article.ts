// Interface cho dữ liệu phân trang articles
export interface ArticlePagination {
  current_page: number
  data: Article[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: { url: string | null; label: string; active: boolean }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

// Interface cho một article
export interface Article {
  id: number
  title: string
  desc: string
  content: string
  keywords: string | null
  created_at: string
  updated_at: string
  show: number
  priority: number
  translate: string | null
}

// Interface cho dữ liệu article insert
export interface ArticleInsert {
  title: string
  desc: string
  content: string
  keywords: string | null
  show: number
  priority: number
}

export interface ArticleType {
  id: number
  title: string
  desc: string
  show: number
}
