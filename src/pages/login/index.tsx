import React, { useEffect, useState } from "react"
import type { FormProps } from "antd"
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  message,
  notification,
  Row,
} from "antd"
import { callLogin } from "../../services/api"
import { useNavigate, useNavigation } from "react-router"
import axios, { AxiosError } from "axios"

type FieldType = {
  email: string
  password: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      navigate("/") // Chuyển hướng về trang chủ nếu đã đăng nhập
    }
  }, [navigate])

  const onFinish: FormProps<FieldType>["onFinish"] = async values => {
    // console.log("Success:", values)
    setIsSubmitting(true)
    try {
      const res = await callLogin(values)
      setIsSubmitting(false)

      if (res?.status === 200 && res?.data?.token) {
        message.success("Đăng nhập tài khoản thành công")
        localStorage.setItem("access_token", res.data.token) // Lưu token vào localStorage
        localStorage.setItem("username", res.data.user.name) // Lưu token vào localStorage
        navigate("/") // Chuyển hướng đến trang chủ hoặc trang mong muốn
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: "Thông tin đăng nhập không chính xác",
          duration: 5,
        })
      }
    } catch (error) {
      setIsSubmitting(false)
      if (axios.isAxiosError(error)) {
        // Kiểm tra nếu lỗi là từ Axios
        notification.error({
          message: "Có lỗi xảy ra",
          description:
            error.response?.data?.message || "Thông tin đăng nhập không đúng",
          duration: 5,
        })
      } else {
        // Xử lý các lỗi không phải từ Axios (ví dụ: lỗi mạng, lỗi khác)
        notification.error({
          message: "Có lỗi xảy ra",
          description: "Đã xảy ra lỗi không xác định khi đăng nhập",
          duration: 5,
        })
      }
    }
  }

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = errorInfo => {
    console.log("Failed:", errorInfo)
  }
  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "70vh" }} // Bao phủ toàn bộ chiều cao màn hình
    >
      <h3 style={{ textAlign: "center", fontWeight: "bold" }}>ĐĂNG NHẬP</h3>
      <Divider />
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <Card
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Bóng đổ dưới thẻ
            borderRadius: "8px", // Góc bo tròn
          }}
        >
          <Form
            name="basic"
            layout="vertical" // Sử dụng layout dạng vertical
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType> label="Email" name="email">
              <Input />
            </Form.Item>

            <Form.Item<FieldType> label="Password" name="password">
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default LoginPage
