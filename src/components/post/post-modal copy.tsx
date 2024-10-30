import { UploadOutlined } from "@ant-design/icons"
import { Button, Cascader, Form, Input, Modal, Switch, Upload } from "antd"
import type { UploadFile } from "antd/es/upload/interface" // Import đúng kiểu dữ liệu

import type React from "react"
import { useState } from "react"
import type { Category } from "../../types/cat"
import type { PostInsert } from "../../types/post"
import TinyMCEEditor from "../tiny-mce-editor"

interface PostModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: PostInsert) => void
  loading: boolean
  initialValues?: PostInsert // Thêm props cho giá trị ban đầu khi chỉnh sửa
}

const PostModal: React.FC<PostModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  initialValues, // Nhận giá trị ban đầu
}) => {
  const [form] = Form.useForm()
  const [content, setContent] = useState(initialValues?.content || "") // Set giá trị ban đầu của nội dung

  console.log("initialValues", initialValues)

  // Thiết lập giá trị ban đầu khi modal mở
  if (initialValues) {
    form.setFieldsValue({
      ...initialValues,
      show: initialValues.show === 1,
      hot: initialValues.hot === 1,
    })
  }

  const handleSubmit = () => {
    form.submit()
  }

  const categories: Category[] = [
    {
      id: 1,
      value: "thi-cong",
      label: "Thi công xây dựng nhà mới",
    },
    {
      id: 2,
      value: "sua-chua-cong-trinh",
      label: "Sửa chữa công trình",
    },
    {
      id: 3,
      value: "ho-boi",
      label: "Hồ bơi",
    },
    {
      id: 4,
      value: "bao-gia",
      label: "Báo giá",
      children: [
        { id: 22, value: "bao-gia-thiet-ke", label: "Báo giá thiết kế" },
        { id: 23, value: "bao-gia-phan-tho", label: "Báo giá phần thô" },
        { id: 24, value: "bao-gia-tron-goi", label: "Báo giá trọn gói" },
        { id: 25, value: "bao-gia-sua-chua", label: "Báo giá sửa chữa" },
        { id: 26, value: "bao-gia-noi-that", label: "Báo giá nội thất" },
      ],
    },
    { id: 5, value: "du-an-tieu-bieu", label: "Dự án tiêu biểu" },
    { id: 6, value: "tin-tuc", label: "Tin tức" },
    { id: 7, value: "gioi-thieu", label: "Giới thiệu" },
    {
      id: 8,
      value: "mau-nha-dep",
      label: "Mẫu nhà đẹp",
      children: [
        { id: 9, value: "mau-nha-4-tang", label: "Mẫu nhà 4 tầng" },
        { id: 10, value: "mau-nha-2-tang", label: "Mẫu nhà 2 tầng" },
      ],
    },
  ]

  const handleChanceCat = (value: (string | undefined)[]) => {
    let selectedCategory: number | null = null

    categories.forEach(category => {
      if (category.children) {
        const child = category.children.find(child => child.value === value[1])
        if (child) {
          selectedCategory = child.id
        }
      }
      if (category.value === value[0] && !selectedCategory) {
        selectedCategory = category.id
      }
    })

    if (selectedCategory) {
      form.setFieldsValue({ menus: selectedCategory })
    }
  }

  // Hiển thị file list từ URL của hình ảnh cũ
  const fileList: UploadFile[] = initialValues?.thumb
    ? [
        {
          uid: "-1",
          name: "thumbnail.png",
          status: "done",
          url: initialValues.thumb as string,
        },
      ]
    : []

  console.log("fileList", fileList)

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
        onFinish={values => onSubmit({ ...values, content })}
        initialValues={{
          ...initialValues,
          show: initialValues?.show === 1,
          hot: initialValues?.hot === 1,
          priority: initialValues?.priority || 0,
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
          name="menus"
          label="Chuyên mục"
          rules={[{ required: true, message: "Vui lòng chọn chuyên mục!" }]}
        >
          <Cascader
            options={categories}
            placeholder="Chọn chuyên mục"
            onChange={value => handleChanceCat(value)}
          />
        </Form.Item>
        <Form.Item
          name="keywords"
          label="Từ khóa"
          rules={[{ required: true, message: "Vui lòng nhập từ khóa!" }]}
        >
          <Input placeholder="Nhập từ khóa, ngăn cách bằng dấu phẩy" />
        </Form.Item>
        <Form.Item
          name="thumb"
          label="Hình ảnh"
          valuePropName="fileList"
          getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
          extra="Tải lên hình ảnh đại diện"
        >
          <Upload
            name="thumb"
            listType="picture"
            beforeUpload={() => false}
            defaultFileList={fileList}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PostModal
