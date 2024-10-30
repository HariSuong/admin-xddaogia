import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { message } from "antd"

const LogoutPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Xóa token và username khỏi localStorage
    localStorage.removeItem("access_token")
    localStorage.removeItem("username")

    // Thông báo logout thành công
    message.success("Bạn đã đăng xuất thành công")

    // Điều hướng về trang login
    navigate("/login")
  }, [navigate])

  return null
}

export default LogoutPage
