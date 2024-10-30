import { UploadOutlined } from "@ant-design/icons"
import { Button, Form, Input, Modal, Switch, Upload } from "antd"
import type React from "react"
import { useState } from "react"
import type { PostInsert } from "../../types/post"
import type { SlideInsert } from "../../types/slide"
import type { ArticleInsert } from "../../types/article"
import CKEditorComponent from "../ck-editor-comp"
import TinyMCEEditor from "../tiny-mce-editor"

interface ArticleModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: ArticleInsert) => void
  loading: boolean
  initialValues?: ArticleInsert // Thêm props cho giá trị ban đầu khi chỉnh sửa
}

const ArticleModal: React.FC<ArticleModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  initialValues, // Nhận giá trị ban đầu
}) => {
  const [form] = Form.useForm()
  const [content, setContent] = useState(initialValues?.content || "") // Set giá trị ban đầu của nội dung

  // Thiết lập giá trị ban đầu khi modal mở
  if (initialValues) {
    form.setFieldsValue({
      ...initialValues,
      show: initialValues.show === 1,
    })
  }

  const handleSubmit = () => {
    form.submit()
  }

  return (
    <Modal
      title={initialValues ? "Chỉnh sửa chính sách" : "Tạo chính sách mới"}
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
        onFinish={values => onSubmit({ ...values, content })}
        initialValues={{
          ...initialValues,
          show: initialValues?.show === 1,
          priority: initialValues?.priority || 0,
        }}
      >
        <Form.Item
          name="title"
          label="Tên chính sách"
          rules={[{ required: true, message: "Vui lòng nhập tên chính sách!" }]}
        >
          <Input placeholder="Nhập tên chính sách" />
        </Form.Item>

        <Form.Item
          name="desc"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea placeholder="Nhập mô tả chính sách" />
        </Form.Item>
        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <TinyMCEEditor value={content} onChange={setContent} />
        </Form.Item>
        <Form.Item
          name="keywords"
          label="Từ khóa"
          rules={[{ required: true, message: "Vui lòng nhập từ khóa!" }]}
        >
          <Input placeholder="Nhập từ khóa, ngăn cách bằng dấu phẩy" />
        </Form.Item>

        <Form.Item name="show" label="Hiển thị" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="priority" label="Ưu tiên">
          <Input type="number" placeholder="Nhập mức độ ưu tiên" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ArticleModal
