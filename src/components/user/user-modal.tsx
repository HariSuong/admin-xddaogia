import { Form, Input, Modal } from "antd"
import type React from "react"
import type { InsertUserType } from "../../types/user"

interface UserModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => void
  loading: boolean
  initialValues?: InsertUserType
  errors?: { [key: string]: string[] } | null // Thêm prop errors để nhận lỗi từ parent
}

const UserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  initialValues,
  errors,
}) => {
  const [form] = Form.useForm()

  // console.log("cats", cats)
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("email", values.email)
      formData.append("phone", values.phone)
      formData.append("password", values.password)

      onSubmit(formData) // Gọi onSubmit với FormData
    })
  }

  return (
    <Modal
      title={initialValues ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={initialValues ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      confirmLoading={loading}
      width={"80%"}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          ...initialValues,
        }}
      >
        <Form.Item
          name="name"
          label="Tên"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          help={errors?.name ? errors.name[0] : null} // Hiển thị lỗi dưới trường input
          validateStatus={errors?.name ? "error" : ""}
        >
          <Input placeholder="Nhập tên bài viết" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Emal"
          rules={[{ required: true, message: "Vui lòng nhập email" }]}
          help={errors?.email ? errors.email[0] : null}
          validateStatus={errors?.email ? "error" : ""}
        >
          <Input.TextArea placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số di động"
          rules={[{ required: true, message: "Vui lòng nhập số di động" }]}
          help={errors?.phone ? errors.phone[0] : null}
          validateStatus={errors?.phone ? "error" : ""}
        >
          <Input.TextArea placeholder="Nhập số di động" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Vui lòng nhập password!" }]}
          help={errors?.password ? errors.password[0] : null}
          validateStatus={errors?.password ? "error" : ""}
        >
          <Input placeholder="Nhập password" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default UserModal
