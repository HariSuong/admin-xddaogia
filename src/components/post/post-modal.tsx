import { Cascader, Form, Input, Modal, Switch } from "antd"
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useAllMenus } from "../../hooks/menus/useMenus"
import type { PostInsert } from "../../types/post"
import { findCategoryNameById } from "../../utils/findCatById"
import TinyMCEEditor from "../tiny-mce-editor"

interface PostModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => void
  loading: boolean
  initialValues?: PostInsert
}

const PostModal: React.FC<PostModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  initialValues,
}) => {
  const [form] = Form.useForm()
  const [content, setContent] = useState(initialValues?.content || "")
  const [thumb, setThumb] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { data: cats } = useAllMenus()

  console.log("cats", cats)

  useEffect(() => {
    if (initialValues?.thumb) {
      setPreview(initialValues.thumb as string) // Hiển thị hình ảnh hiện có nếu có
    }
  }, [initialValues])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setThumb(file)
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
  // console.log("cats", cats)
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("desc", values.desc)
      formData.append("keywords", values.keywords)
      formData.append("content", values.content || content)
      formData.append("show", values.show ? "1" : "0")
      formData.append("hot", values.hot ? "1" : "0")
      formData.append("priority", values.priority || "0")
      // Lưu id của chuyên mục
      formData.append("menus", values.menus)

      if (thumb) {
        formData.append("thumb", thumb) // Nếu có file mới, thêm vào form
      } else if (initialValues?.thumb) {
        formData.append("thumb", initialValues.thumb) // Nếu không có thay đổi thì giữ nguyên URL
      }

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
          show: initialValues?.show === 1,
          hot: initialValues?.hot === 1,
        }}
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item
          name="desc"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea placeholder="Nhập mô tả ngắn" />
        </Form.Item>
        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <TinyMCEEditor value={content} onChange={setContent} />
        </Form.Item>
        <Form.Item name="show" label="Hiển thị" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="hot" label="Hot" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="priority" label="Ưu tiên">
          <Input type="number" placeholder="Nhập mức độ ưu tiên" />
        </Form.Item>
        <Form.Item
          name="keywords"
          label="Từ khóa"
          rules={[{ required: true, message: "Vui lòng nhập từ khóa!" }]}
        >
          <Input placeholder="Nhập từ khóa bài viết" />
        </Form.Item>
        <Form.Item
          name="menus"
          label="Chuyên mục"
          rules={[{ required: true, message: "Vui lòng chọn chuyên mục!" }]}
        >
          <Cascader
            options={cats?.data || []}
            placeholder="Chọn chuyên mục"
            // onChange={value => handleChanceCat(value)}
            fieldNames={{ label: "name", value: "id", children: "children" }} // Sử dụng "name" cho label và "id" cho value
            onChange={value => {
              if (value && value.length > 0) {
                console.log("Selected ID:", value[value.length - 1]) // Log để xem id cuối cùng
                form.setFieldsValue({ menus: value[value.length - 1] })
              }
            }}
            displayRender={labels => {
              // Tìm danh mục dựa trên ID cuối cùng bằng cách tái sử dụng findCategoryPathById
              const lastId = Number(labels[labels.length - 1])
              if (lastId) return findCategoryNameById(lastId)
              else return labels[labels.length - 1]
            }} // Chỉ hiển thị tên danh mục cuối cùng
          />
        </Form.Item>
        <Form.Item
          name="thumb"
          label="Hình ảnh"
          extra="Tải lên hình ảnh đại diện"
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

export default PostModal
