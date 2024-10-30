import { categories } from "../components/post/cat-demo"

// Hiển thị tên trên post-table
export const findCategoryNameById = (id: number) => {
  for (const category of categories) {
    if (category.id === Number(id)) {
      return category.label // Trả về tên của chuyên mục
    }

    if (category.children) {
      const child = category.children.find(child => child.id === Number(id))

      if (child) {
        return child.label // Nếu tìm thấy con, trả về tên của chuyên mục con
      }
    }
  }
  return id.toString() // Nếu không tìm thấy, trả về ID dưới dạng chuỗi
}
