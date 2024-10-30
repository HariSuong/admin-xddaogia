export interface PostInsert {
  title: string
  desc: string
  content: string
  show: number
  hot: number
  priority: number
  menus: string
  keywords: string
  // thumb: File | null // Nếu bạn muốn hỗ trợ việc upload file hình ảnh
  thumb: string | File | null // Accept string for existing image URL
}

export interface Post {
  id: number
  user: number
  title: string
  desc?: string | undefined
  content: string
  thumb: string
  keywords?: string
  created_at: string
  updated_at: string
  show: number
  hot: number
  priority?: number
  count_view?: number
  translate?: null
  video?: string
  menus: number
}

export interface PostPagination {
  current_page: number
  data: Post[]
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

export interface PostItemProps {
  id: number
  title: string
  description: string
  thumb: string
}

export interface PostListProps {
  products: Post[]
}

export interface PostDetail {
  id: number
  title: string
  thumb: string
  desc: string
  hot: number
  video: string
  content: string
  keywords: string[]
  menus: {
    id: number
    name: string
    thumb: string
    desc: string | null
    content: string
    video: string
    type_thumb_video: string
  }
  count_view: number
  related: {
    id: number
    title: string
    desc: string
    thumb: string
    count_view: number
  }[]
}

export interface PostType {
  id: number
  title: string
  menus: number
  show: number
  hot: number
}
