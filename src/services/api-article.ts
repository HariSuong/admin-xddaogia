import axios from "axios"

import { baseURL } from "../utils/axios-customize"
import type { ArticlePagination } from "../types/article"

// Thêm hàm gọi danh sách người dùng
export const getArticles = async (page: number): Promise<ArticlePagination> => {
  const token = localStorage.getItem("access_token") // hoặc lấy token từ state quản lý
  // console.log("access_token", token)
  const response = await axios.get(
    `${baseURL}/api/admin/articles/?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm Bearer Token vào request headers
      },
    },
  )
  return response.data // Đảm bảo trả về dữ liệu cần thiết
}

// Hàm để gọi API chèn bài viết mới
export const insertArticle = async (articleData: FormData): Promise<void> => {
  const token = localStorage.getItem("access_token") // Lấy token từ localStorage

  // Gửi dữ liệu dưới dạng FormData
  await axios.post(`${baseURL}/api/admin/articles/insert`, articleData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Đảm bảo backend nhận dạng đúng kiểu dữ liệu
    },
  })
}

// Hàm để cập nhật bài viết
export const updateArticle = async ({
  id,
  formData,
}: {
  id: number
  formData: FormData
}): Promise<void> => {
  const token = localStorage.getItem("access_token")
  await axios.post(`${baseURL}/api/admin/articles/update/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
}

// // Function to delete a article by its ID
export const deleteArticles = async (id: number): Promise<void> => {
  const token = localStorage.getItem("access_token") // Get token from localStorage
  await axios.delete(`${baseURL}/api/admin/articles/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Add Bearer Token to request headers
    },
  })
}
