export interface Category {
  id: number
  value: string
  label: string
  children?: Category[] // Có thể có hoặc không children
}

export const categories: Category[] = [
  {
    id: 1,
    value: "thi-cong",
    label: "Thi công xây dựng nhà mới",
  },
  {
    id: 2,
    value: "sua-chua-cong-trinh",
    label: "Sửa chữa công trình",
  },
  {
    id: 3,
    value: "ho-boi",
    label: "Hồ bơi",
  },
  {
    id: 4,
    value: "bao-gia",
    label: "Báo giá",
    children: [
      { id: 22, value: "bao-gia-thiet-ke", label: "Báo giá thiết kế" },
      { id: 23, value: "bao-gia-phan-tho", label: "Báo giá phần thô" },
      { id: 24, value: "bao-gia-tron-goi", label: "Báo giá trọn gói" },
      { id: 25, value: "bao-gia-sua-chua", label: "Báo giá sửa chữa" },
      { id: 26, value: "bao-gia-noi-that", label: "Báo giá nội thất" },
    ],
  },
  { id: 5, value: "du-an-tieu-bieu", label: "Dự án tiêu biểu" },
  { id: 6, value: "tin-tuc", label: "Tin tức" },
  { id: 7, value: "gioi-thieu", label: "Giới thiệu" },
  {
    id: 8,
    value: "mau-nha-dep",
    label: "Mẫu nhà đẹp",
    children: [
      { id: 9, value: "mau-nha-4-tang", label: "Mẫu nhà 4 tầng" },
      { id: 10, value: "mau-nha-2-tang", label: "Mẫu nhà 2 tầng" },
    ],
  },
]
