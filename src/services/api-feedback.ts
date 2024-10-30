import axios from "axios"
import type { Feedback, FeedbackPagination } from "../types/feedback"
import { baseURL } from "../utils/axios-customize"

// Thêm hàm gọi danh sách người dùng
export const getFeedbacks = async (
  page: number,
): Promise<FeedbackPagination> => {
  const token = localStorage.getItem("access_token") // hoặc lấy token từ state quản lý
  // console.log("access_token", token)
  const response = await axios.get(
    `${baseURL}/api/admin/feedbacks/?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm Bearer Token vào request headers
      },
    },
  )
  return response.data // Đảm bảo trả về dữ liệu cần thiết
}

// Hàm để gọi API chèn bài viết mới
export const insertFeedback = async (feedbackData: FormData): Promise<void> => {
  const token = localStorage.getItem("access_token") // Lấy token từ localStorage

  // Gửi dữ liệu dưới dạng FormData
  await axios.post(`${baseURL}/api/admin/feedbacks/insert`, feedbackData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Đảm bảo backend nhận dạng đúng kiểu dữ liệu
    },
  })
}

// Hàm để cập nhật bài viết
export const updateFeedback = async ({
  id,
  formData,
}: {
  id: number
  formData: FormData
}): Promise<void> => {
  const token = localStorage.getItem("access_token")
  await axios.post(`${baseURL}/api/admin/feedbacks/update/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
}

// Hàm để lấy nội dung cập nhật bài viết
export const getFeedbackById = async ({
  id,
}: {
  id: number
}): Promise<Feedback> => {
  const token = localStorage.getItem("access_token")

  const response = await axios.post(
    `${baseURL}/api/admin/feedbacks/update/${id}?getData=1`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm Bearer Token vào request headers
      },
    },
  )
  return response.data // Trả về dữ liệu bài viết
}

// Function to delete a feedback by its ID
export const deleteFeedback = async (id: number): Promise<void> => {
  const token = localStorage.getItem("access_token") // Get token from localStorage
  await axios.delete(`${baseURL}/api/admin/feedbacks/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Add Bearer Token to request headers
    },
  })
}
