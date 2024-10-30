import { UploadOutlined } from "@ant-design/icons"
import { Button, Form, Input, Modal, Switch, Upload } from "antd"
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import type { PostInsert } from "../../types/post"
import type { FeedbackInsert } from "../../types/feedback"
import { useDropzone } from "react-dropzone"

interface FeedbackModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => void
  loading: boolean
  initialValues?: FeedbackInsert // Thêm props cho giá trị ban đầu khi chỉnh sửa
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  initialValues, // Nhận giá trị ban đầu
}) => {
  const [form] = Form.useForm()
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (initialValues?.avatar) {
      setPreview(initialValues.avatar as string) // Hiển thị hình ảnh hiện có nếu có
    }
  }, [initialValues])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setAvatar(file)
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [], // Sử dụng object thay vì string
    },
    maxFiles: 1,
  })

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("star", String(values.star))
      formData.append("content", values.content)
      formData.append("show", values.show ? "1" : "0")
      formData.append("url", values.url ? values.url : "")
      formData.append("priority", String(values.priority))

      if (avatar) {
        formData.append("avatar", avatar) // Nếu có file mới, thêm vào form
      } else if (initialValues?.avatar) {
        formData.append("avatar", initialValues.avatar) // Nếu không có thay đổi thì giữ nguyên URL
      }

      onSubmit(formData) // Gọi onSubmit với FormData
    })
  }

  return (
    <Modal
      title={initialValues ? "Chỉnh sửa đánh giá" : "Tạo đánh giá mới"}
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={initialValues ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={values => onSubmit({ ...values })}
        initialValues={{
          ...initialValues,
          show: initialValues?.show === 1,
          priority: initialValues?.priority || 0,
        }}
      >
        <Form.Item
          name="avatar"
          label="Ảnh đại diện"
          valuePropName="fileList"
          getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
          extra="Tải lên hình ảnh đại diện"
        >
          {/* <Upload name="avatar" listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Chọn ảnh đại diện</Button>
          </Upload> */}
          <div {...getRootProps()} style={styles.dropzone}>
            <input {...getInputProps()} />
            {preview ? (
              <img src={preview} alt="Preview" style={styles.previewImage} />
            ) : (
              <p>Kéo và thả hình ảnh vào đây, hoặc nhấn để chọn</p>
            )}
          </div>
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên khách hàng"
          rules={[{ required: true, message: "Vui lòng nhập tên khách hàng!" }]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <Input.TextArea placeholder="Nhập nội dung đánh giá" />
        </Form.Item>
        <Form.Item
          name="star"
          label="Đánh giá bao nhiêu sao"
          // rules={[{ required: true, message: "Vui lòng nhập số sao!" }]}
        >
          <Input
            type="number"
            placeholder="Nhập số sao bạn đánh giá"
            min={0}
            max={5}
          />
        </Form.Item>

        <Form.Item name="show" label="Hiển thị" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="priority" label="Ưu tiên">
          <Input type="number" placeholder="Nhập mức độ ưu tiên" />
        </Form.Item>
        <Form.Item
          name="url"
          label="Đường link"
          // rules={[{ required: true, message: "Vui lòng nhập tên khách hàng!" }]}
        >
          <Input placeholder="Nhập tên đường link" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const styles = {
  dropzone: {
    border: "2px dashed #d9d9d9",
    padding: "20px",
    textAlign: "center" as "center",
    cursor: "pointer",
    marginBottom: "10px",
  },
  previewImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover" as "cover",
  },
}

export default FeedbackModal
