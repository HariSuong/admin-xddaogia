import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { Form, Input, Modal, Switch, Cascader, Upload, Button } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import CKEditorComponent from "../ck-editor-comp"
import type { Category } from "../../types/cat"
import type { MenuInsert } from "../../types/menu"
import { useDropzone } from "react-dropzone"
import { useAllMenus } from "../../hooks/menus/useMenus"
import { findCategoryNameById } from "../../utils/findCatById"
import { display_type } from "./display-type"

interface MenuModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: FormData) => void
  loading: boolean
  initialValues?: MenuInsert // Thêm props cho giá trị ban đầu khi chỉnh sửa
}

const MenuModal: React.FC<MenuModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  initialValues, // Nhận giá trị ban đầu
}) => {
  const [form] = Form.useForm()
  const [thumb, setThumb] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { data: cats } = useAllMenus()

  useEffect(() => {
    if (initialValues?.thumb) {
      setPreview(initialValues?.thumb as unknown as string) // Hiển thị hình ảnh hiện có nếu có
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

  // Thiết lập giá trị ban đầu khi modal mở
  if (initialValues) {
    form.setFieldsValue({
      ...initialValues,
      show: initialValues.show === 1,
      hot: initialValues.hot === 1,
    })
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("desc", values.desc)
      formData.append("keywords", values.keywords)

      formData.append("show", values.show ? "1" : "0")
      formData.append("hot", values.hot ? "1" : "0")
      formData.append("order", values.order || "0")
      // Lưu id của chuyên mục
      formData.append("inside", values.inside || 0)
      formData.append("display_type", values.display_type || "0")

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
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={values => onSubmit({ ...values })}
        initialValues={{
          ...initialValues,
          show: initialValues?.show === 1,
          hot: initialValues?.hot === 1,
          order: initialValues?.order || 0,
        }}
      >
        <Form.Item
          name="name"
          label="Tên chuyên mục"
          rules={[{ required: true, message: "Vui lòng nhập tên chuyên mục!" }]}
        >
          <Input placeholder="Nhập tên chuyên mục" />
        </Form.Item>
        <Form.Item
          name="desc"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea placeholder="Nhập mô tả ngắn" />
        </Form.Item>

        <Form.Item name="show" label="Hiển thị" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="hot" label="Hot" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          name="inside"
          label="Chuyên mục"
          // rules={[{ required: true, message: "Vui lòng chọn chuyên mục!" }]}
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
          name="display_type"
          label="Chọn loại chuyên mục"
          // rules={[
          //   { required: true, message: "Vui lòng chọn loại chuyên mục!" },
          // ]}
        >
          <Cascader
            options={display_type || []}
            placeholder="Chọn chuyên mục"
            // onChange={value => handleChanceCat(value)}
            fieldNames={{ label: "name", value: "id" }} // Sử dụng "name" cho label và "id" cho value
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
        <Form.Item name="order" label="Ưu tiên">
          <Input type="number" placeholder="Nhập mức độ ưu tiên" />
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

export default MenuModal
