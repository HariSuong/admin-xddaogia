import type React from "react"
import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute: React.FC<any> = () => {
  const token = localStorage.getItem("access_token") // Lấy access_token từ localStorage

  if (!token) {
    return <Navigate to="/login" /> // Nếu không có token, chuyển hướng đến trang login
  }

  return <Outlet /> // Nếu có token, cho phép truy cập các route con
}

export default PrivateRoute
