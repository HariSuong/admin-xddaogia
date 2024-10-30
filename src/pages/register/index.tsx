import React, { useEffect } from "react"
import type { FormProps } from "antd"
import { Button, Card, Divider, Form, Input } from "antd"
import { Col, Row } from "antd"
import { useNavigate } from "react-router"

type FieldType = {
  email?: string
  password?: string
}

// const onFinish: FormProps<FieldType>["onFinish"] = values => {
//   console.log("Success:", values)
// }

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = errorInfo => {
  console.log("Failed:", errorInfo)
}

const RegisterPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      navigate("/") // Chuyển hướng về trang chủ nếu đã đăng nhập
    }
  }, [navigate])

  const onFinish: FormProps<FieldType>["onFinish"]  = values => {
    console.log("Success:", values)
  }
  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh" }} // Bao phủ toàn bộ chiều cao màn hình
    >
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <Card
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Bóng đổ dưới thẻ
            borderRadius: "8px", // Góc bo tròn
          }}
        >
          {/* Responsive */}
          <h3 style={{ textAlign: "center", fontWeight: "bold" }}>
            Đăng Ký Tài Khoản
          </h3>
          <Divider />
          <Form
            name="basic"
            layout="vertical" // Sử dụng layout dạng vertical
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email không được để trống!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Mật khẩu không được để trống!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit" loading={true}>
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </Card>{" "}
      </Col>
    </Row>
  )
}

export default RegisterPage
