export interface Category {
  id: number
  value: string
  label: string
  children?: Category[] // Có thể có hoặc không children
}
