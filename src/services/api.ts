import type { LoginProps } from "../types/auth"
import type { User, UserPagination } from "../types/user"
import axios, { baseURL } from "../utils/axios-customize"

export const callLogin = ({ email, password }: LoginProps) => {
  return axios.post(`${baseURL}/api/admin/login`, { email, password })
}
// https://xddaogia.vn/public/api/admin/users?page=1

/****
 ** USER
 */
// Thêm hàm gọi danh sách người dùng
export const getUsers = async (page: number): Promise<UserPagination> => {
  const token = localStorage.getItem("access_token") // hoặc lấy token từ state quản lý

  const response = await axios.get(`${baseURL}/api/admin/users/?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Thêm Bearer Token vào request headers
    },
  })
  return response.data // Đảm bảo trả về dữ liệu cần thiết
}

// Hàm gọi API để thêm người dùng
export const insertUser = async (userData: FormData): Promise<void> => {
  const token = localStorage.getItem("access_token") // Lấy token từ localStorage
  // Gửi dữ liệu dưới dạng FormData
  await axios.post(`${baseURL}/api/admin/users/insert`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Đảm bảo backend nhận dạng đúng kiểu dữ liệu
    },
  })
}

// // Hàm gọi API để cập nhật người dùng

export const updateUser = async ({
  id,
  formData,
}: {
  id: number
  formData: FormData
}): Promise<void> => {
  const token = localStorage.getItem("access_token")
  await axios.post(`${baseURL}/api/admin/users/update/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
}

// Hàm để lấy nội dung cập nhật bài viết
export const getUserById = async ({ id }: { id: number }): Promise<User> => {
  const token = localStorage.getItem("access_token")

  const response = await axios.post(
    `${baseURL}/api/admin/users/update/${id}?getData=1`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm Bearer Token vào request headers
      },
    },
  )
  return response.data // Trả về dữ liệu bài viết
}

// // Hàm gọi API để xóa người dùng
export const deleteUser = async (id: number) => {
  const token = localStorage.getItem("access_token") // Get token from localStorage
  await axios.delete(`${baseURL}/api/admin/users/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Add Bearer Token to request headers
    },
  })
}

/****
 ** !USER
 */
