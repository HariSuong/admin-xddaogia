import { UploadOutlined } from "@ant-design/icons"
import { Button, Form, Input, Modal, Switch, Upload } from "antd"
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import type { PostInsert } from "../../types/post"
import type { SlideInsert } from "../../types/slide"
import { useDropzone } from "react-dropzone"

interface SlideModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => void
  loading: boolean
  initialValues?: SlideInsert // Thêm props cho giá trị ban đầu khi chỉnh sửa
}

const SlideModal: React.FC<SlideModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  initialValues, // Nhận giá trị ban đầu
}) => {
  const [form] = Form.useForm()

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  console.log("initialValues", initialValues)
  useEffect(() => {
    if (initialValues?.image) {
      setPreview(initialValues.image as string) // Hiển thị hình ảnh hiện có nếu có
    }
  }, [initialValues])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setImage(file)
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

  // Thiết lập giá trị ban đầu khi modal mở
  // if (initialValues) {
  //   form.setFieldsValue({
  //     ...initialValues,
  //     show: initialValues.show === 1,
  //   })
  // }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formData = new FormData()
      formData.append("link", values.link ? values.link : "")
      formData.append("target", values.target ? values.target : "")
      formData.append("order", String(values.order))
      formData.append("show", values.show ? "1" : "0")
      formData.append("title", values.title)
      formData.append("desc", values.desc)
      console.log("image", image)
      if (image) {
        formData.append("image", image) // Nếu có file mới, thêm vào form
      } else if (initialValues?.image) {
        formData.append("image", initialValues.image) // Nếu không có thay đổi thì giữ nguyên URL
      }

      onSubmit(formData) // Gọi onSubmit với FormData
    })
  }

  return (
    <Modal
      title={initialValues ? "Chỉnh sửa slider" : "Tạo slider mới"}
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
          order: initialValues?.order || 0,
        }}
      >
        <Form.Item
          name="image"
          label="Hình ảnh"
          valuePropName="fileList"
          getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
          extra="Tải lên hình ảnh slide"
        >
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
          name="title"
          label="Tên hình ảnh"
          rules={[{ required: true, message: "Vui lòng nhập tên hình ảnh!" }]}
        >
          <Input placeholder="Nhập tên hình ảnh" />
        </Form.Item>

        <Form.Item
          name="desc"
          label="Nội dung"
          // values.target  rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <Input.TextArea placeholder="Nhập nội dung slider" />
        </Form.Item>
        <Form.Item name="link" label="Nhập link">
          <Input placeholder="Nhập link" />
        </Form.Item>
        <Form.Item name="target" label="Nhập target">
          <Input placeholder="Nhập target" />
        </Form.Item>

        <Form.Item name="show" label="Hiển thị" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="order" label="Ưu tiên">
          <Input type="number" placeholder="Nhập mức độ ưu tiên" />
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

export default SlideModal
