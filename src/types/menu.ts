// Interface cho một menu item
export interface MenuItem {
  id: number
  name: string
  thumb: string
  inside: number
  children: ChildMenuItem[]
}

// Interface cho một child menu item (con của menu)
export interface ChildMenuItem {
  id: number
  name: string
  thumb: string
  inside: number
}

// Interface cho dữ liệu phân trang menus
export interface MenuPagination {
  current_page: number

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
  data: MenuItem[]
}

// Interface cho dữ liệu insert một menu
export interface MenuInsert {
  name: string // Tên menu
  desc?: string // Mô tả menu
  display_type?: number // Loại hiển thị
  inside: number // Giá trị inside của menu
  show?: number // Trạng thái hiển thị
  order?: number // Thứ tự sắp xếp
  thumb?: File | null // Hình ảnh thumbnail, có thể là file hoặc null nếu không có
  hot?: number // Trạng thái hot của menu
}

export interface MenuType {
  id: number
  name: string
  // thumb: string
  // inside: number
  // children: ChildMenuItem[]
}

export interface MenuById {
  id: number
  icon?: string | null
  thumb?: string | null
  name: string
  desc: string
  content?: string | null
  keywords: string | null
  display_type: number
  inside: number
  hot: number
  show: number
  order: number
  translate: string | null
  type_thumb_video: string
  video: string | null
  created_at: string
  updated_at: string
}

/**name: string // Tên menu
  desc?: string // Mô tả menu
  display_type?: number // Loại hiển thị
  inside: number // Giá trị inside của menu
  show?: number // Trạng thái hiển thị
  order?: number // Thứ tự sắp xếp
  thumb?: File | null // Hình ảnh thumbnail, có thể là file hoặc null nếu không có
  hot?: number // Trạng thái hot của menu */
