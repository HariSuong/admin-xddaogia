import type { TableColumnsType, TableProps } from "antd"
import { Button, message, Modal, Table } from "antd"
import { useState } from "react"
import { FaPencil, FaTrashCan } from "react-icons/fa6"
import { renderHeader } from "../render-header"

import { useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { convertDataArticleToArticleInsert } from "../../utils/lib"
import Loading from "../loading"
// import FeedbackModal from "./feedback-modal"
import { useArticles } from "../../hooks/article/useArticles"
import { useDeleteArticle } from "../../hooks/article/useDeleteArticle"
import { useInsertArticle } from "../../hooks/article/useInsertArticle"
import { useUpdateArticle } from "../../hooks/article/useUpdateArticle"

import type { ArticleInsert, ArticleType } from "../../types/article"
import SlideModal from "./article-modal"

const ArticleTable: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  const [editingFeedback, setEditingFeedback] = useState<
    ArticleInsert | ArticleType | undefined
  >(undefined) // State cập nhật edit
  const [editingId, setEditingId] = useState<number | null>(null)
  // State cập nhật delete
  const [isDeleting, setIsDeleting] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams() // Để thay đổi giá trị page trong URL

  // Sử dụng QueryClient để invalidate dữ liệu
  const queryClient = useQueryClient()

  const { data: articleData, isPending, error } = useArticles()
  const { current_page, per_page, total } = articleData || {}

  const {
    mutate: insertAricle,
    isPending: isSubmitting,
    error: errorAricle,
  } = useInsertArticle()

  // console.log(slidesData)

  // Use the delete mutation
  const { mutate: deleteAricle } = useDeleteArticle()

  // Gọi updatePost khi cần cập nhật
  const { mutate: updateAricle } = useUpdateArticle()

  if (error) return <div>Error: {error.message}</div>
  if (errorAricle) return <div>Error: {errorAricle.message}</div>
  if (isPending) return <Loading />
  if (isSubmitting) return <Loading />

  const dataWithKey = articleData?.data.map(article => ({
    key: article.id, // Thêm key cho mỗi đối tượng
    id: article.id,
    title: article.title,
    desc: article.desc,
    show: article.show,
  }))

  // Onchange để thay đổi page
  const onChange: TableProps<ArticleType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra,
  ) => {
    // console.log("params", pagination, filters, sorter, extra)
    // Cập nhật lại searchParams khi người dùng chuyển trang
    setSearchParams({ page: pagination.current?.toString() || "1" })
  }

  // SET MODAL OPEN
  const handleAddClick = () => {
    setModalOpen(true)
  }

  // SET MODAL CLOSE
  const handleModalClose = () => {
    setModalOpen(false)
  }

  // Hàm mở modal và đặt feedbacks đang chỉnh sửa
  const handleEditClick = (record: ArticleType) => {
    // Tìm feedbacks đầy đủ từ dataPost
    const fullSlide = articleData?.data.find(
      article => article.id === record.id,
    )

    console.log("fullSlide", fullSlide)
    if (fullSlide) {
      const ArticleInsertDataArticle =
        convertDataArticleToArticleInsert(fullSlide)
      console.log("before", fullSlide)
      setEditingId(fullSlide.id) // Save the id separately
      // console.log("feedbackInsertData", feedbackInsertData)
      setEditingFeedback(ArticleInsertDataArticle)
      setModalOpen(true)
    }
  }

  // HANDLE SUBMIT (Thêm hoặc cập nhật)
  const handleModalSubmit = (values: any) => {
    setIsSubmit(true)

    const formData = new FormData()

    formData.append("content", values.content)
    formData.append("keywords", values.keywords)
    formData.append("priority", String(values.priority))
    formData.append("show", values.show ? "1" : "0")
    formData.append("title", values.title)
    formData.append("desc", values.desc)

    // Log ra tất cả các giá trị trong FormData
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ": " + pair[1])
    // }

    // Kiểm tra nếu đang chỉnh sửa, gọi update
    if (editingFeedback && editingId !== null) {
      // title: string
      // desc: string
      // content: string
      // keywords: string | null
      // show: number
      // priority: number

      updateAricle(
        { id: editingId, formData },
        {
          onSuccess: () => {
            message.success("Chính sách đã được cập nhật thành công!")
            queryClient.invalidateQueries({ queryKey: ["articles"] })
            setModalOpen(false)
            setEditingFeedback(undefined) // Xóa trạng thái Chính sách đang chỉnh sửa
            setEditingId(null) // Reset the id after update
            setIsSubmit(false)
          },
          onError: error => {
            console.error("Error updating article:", error)
            setIsSubmit(false)
          },
        },
      )
    } else {
      // Nếu không thì thêm mới
      insertAricle(formData, {
        onSuccess: () => {
          message.success("Chính sách đã được thêm thành công!")
          queryClient.invalidateQueries({ queryKey: ["articles"] })
          setModalOpen(false)
          setIsSubmit(false)
        },
        onError: error => {
          console.error("Error adding article:", error)
          setIsSubmit(false)
        },
      })
    }
  }

  // Function to handle delete click
  const handleDeleteClick = (id: number) => {
    Modal.confirm({
      title: "Xóa Slide",
      content: "Bạn có chắc chắn muốn xóa chính sách này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        setIsDeleting(true)
        deleteAricle(id, {
          onSuccess: () => {
            message.success("Chính sách đã được xóa thành công!")
            queryClient.invalidateQueries({ queryKey: ["articles"] }) // Refresh the posts data
            setIsDeleting(false)
          },
          onError: error => {
            message.error("Đã xảy ra lỗi khi xóa chính sách.")
            console.error("Error deleting article:", error)
            setIsDeleting(false)
          },
        })
      },
    })
  }

  // id: number
  // title: string
  // desc: string
  // show: number

  // Column table
  const columns: TableColumnsType<ArticleType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },

    {
      title: "Tên",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "desc",
      key: "desc",
      render: (text: string) => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            maxWidth: "500px", // Điều chỉnh kích thước tối đa của ô theo nhu cầu
            overflowWrap: "break-word",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Show",
      dataIndex: "show",
      key: "show",
      render: (show: number) => (show ? "Yes" : "No"),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="link"
            icon={<FaPencil />}
            onClick={() => handleEditClick(record)}
          />
          <Button
            type="link"
            icon={<FaTrashCan fill="red" />}
            onClick={() => handleDeleteClick(record.id)}
            loading={isDeleting}
          />
        </div>
      ),
    },
  ]

  return (
    <>
      <Table
        title={() =>
          renderHeader("Danh sách chính sách cho khách hàng", handleAddClick)
        }
        columns={columns}
        dataSource={dataWithKey}
        rowKey="id"
        onChange={onChange}
        pagination={{
          current: current_page,
          pageSize: per_page,
          total,
          showSizeChanger: true,
        }}
      />

      <SlideModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        loading={isSubmit}
        initialValues={
          editingFeedback ? (editingFeedback as ArticleInsert) : undefined
        } // Explicitly typecast if required
      />
    </>
  )
}

export default ArticleTable
