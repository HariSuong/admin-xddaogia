import axios from "axios"

import { baseURL } from "../utils/axios-customize"
import type {
  ChildMenuItem,
  MenuInsert,
  MenuItem,
  MenuPagination,
} from "../types/menu"

// Thêm hàm gọi danh sách người dùng

export const getAllMenus = async (): Promise<MenuPagination> => {
  const token = localStorage.getItem("access_token") // hoặc lấy token từ state quản lý
  // console.log("access_token", token)
  const response = await axios.get(`${baseURL}/api/admin/menus/all`, {
    headers: {
      Authorization: `Bearer ${token}`, // Thêm Bearer Token vào request headers
    },
  })
  return response.data // Đảm bảo trả về dữ liệu cần thiết
}

export const getMenus = async (page: number): Promise<MenuPagination> => {
  const token = localStorage.getItem("access_token") // hoặc lấy token từ state quản lý
  // console.log("access_token", token)
  const response = await axios.get(`${baseURL}/api/admin/menus/?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Thêm Bearer Token vào request headers
    },
  })
  return response.data // Đảm bảo trả về dữ liệu cần thiết
}

// apiPost.ts

// Hàm để gọi API chèn bài viết mới
export const insertMenu = async (postData: FormData): Promise<void> => {
  const token = localStorage.getItem("access_token") // Lấy token từ localStorage

  // Gửi dữ liệu dưới dạng FormData
  await axios.post(`${baseURL}/api/admin/menus/insert`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Đảm bảo backend nhận dạng đúng kiểu dữ liệu
    },
  })
}

// Hàm để cập nhật bài viết
export const updateMenu = async ({
  id,
  formData,
}: {
  id: number
  formData: FormData
}): Promise<void> => {
  const token = localStorage.getItem("access_token")
  await axios.post(`${baseURL}/api/admin/menus/update/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
}

// Hàm để lấy nội dung cập nhật bài viết
export const getMenuById = async ({
  id,
}: {
  id: number
}): Promise<MenuInsert> => {
  const token = localStorage.getItem("access_token")

  const response = await axios.post(
    `${baseURL}/api/admin/menus/update/${id}?getData=1`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm Bearer Token vào request headers
      },
    },
  )
  return response.data // Trả về dữ liệu bài viết
}

// Function to delete a post by its ID
export const deleteMenu = async (id: number): Promise<void> => {
  const token = localStorage.getItem("access_token") // Get token from localStorage
  await axios.delete(`${baseURL}/api/admin/menus/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Add Bearer Token to request headers
    },
  })
}
