import axios from "axios"

import { baseURL } from "../utils/axios-customize"
import type { Slide, SlidePagination } from "../types/slide"

// Thêm hàm gọi danh sách người dùng
export const getSlides = async (page: number): Promise<SlidePagination> => {
  const token = localStorage.getItem("access_token") // hoặc lấy token từ state quản lý
  // console.log("access_token", token)
  const response = await axios.get(
    `${baseURL}/api/admin/slides/?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm Bearer Token vào request headers
      },
    },
  )
  return response.data // Đảm bảo trả về dữ liệu cần thiết
}

// Hàm để gọi API chèn bài viết mới
export const insertSlide = async (slideData: FormData): Promise<void> => {
  const token = localStorage.getItem("access_token") // Lấy token từ localStorage

  // Gửi dữ liệu dưới dạng FormData
  await axios.post(`${baseURL}/api/admin/slides/insert`, slideData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Đảm bảo backend nhận dạng đúng kiểu dữ liệu
    },
  })
}

// Hàm để cập nhật bài viết
export const updateSlide = async ({
  id,
  formData,
}: {
  id: number
  formData: FormData
}): Promise<void> => {
  const token = localStorage.getItem("access_token")
  await axios.post(`${baseURL}/api/admin/slides/update/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
}

// Hàm để lấy nội dung cập nhật bài viết
export const getSlideById = async ({ id }: { id: number }): Promise<Slide> => {
  const token = localStorage.getItem("access_token")

  const response = await axios.post(
    `${baseURL}/api/admin/slides/update/${id}?getData=1`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm Bearer Token vào request headers
      },
    },
  )
  return response.data // Trả về dữ liệu bài viết
}

// // Function to delete a slide by its ID
export const deleteSlide = async (id: number): Promise<void> => {
  const token = localStorage.getItem("access_token") // Get token from localStorage
  await axios.delete(`${baseURL}/api/admin/slides/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Add Bearer Token to request headers
    },
  })
}
