import type { TableColumnsType, TableProps } from "antd"
import { Button, message, Modal, Table } from "antd"
import { useEffect, useState } from "react"
import { FaPencil, FaTrashCan } from "react-icons/fa6"
import { renderHeader } from "../render-header"

import { useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { useDeleteFeedback } from "../../hooks/feedbacks/useDeleteFeedback"
import {
  useFeedbackById,
  useFeedbacks,
} from "../../hooks/feedbacks/useFeedbacks"
import { useInsertFeedbacks } from "../../hooks/feedbacks/useInsertFeedback"
import { useUpdateFeedback } from "../../hooks/feedbacks/useUpdateFeedback"
import type { FeedbackInsert, FeedbackType } from "../../types/feedback"
import { convertDataFeedbackToFeedbackInsert } from "../../utils/lib"
import Loading from "../loading"
import FeedbackModal from "./feedback-modal"

const FeedbackTable: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  const [editingFeedback, setEditingFeedback] = useState<
    FeedbackInsert | FeedbackType | null
  >(null) // State cập nhật edit
  const [editingId, setEditingId] = useState<number | null>(null)
  // State cập nhật delete
  const [isDeleting, setIsDeleting] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams() // Để thay đổi giá trị page trong URL

  // Sử dụng QueryClient để invalidate dữ liệu
  const queryClient = useQueryClient()

  const { data: feedbackData, isPending, error } = useFeedbacks()
  const { current_page, per_page, total } = feedbackData || {}
  const {
    mutate: insertFeedback,
    isPending: isSubmitting,
    error: errorFeedback,
  } = useInsertFeedbacks()

  const { data: feedbackId } = useFeedbackById(editingId as number)

  // Use the delete mutation
  const { mutate: deleteFeedback } = useDeleteFeedback()

  // Gọi updatePost khi cần cập nhật
  const { mutate: updateFeedback } = useUpdateFeedback()

  useEffect(() => {
    // console.log("postData", postData)
    if (feedbackId) {
      const feedbackInsertData = convertDataFeedbackToFeedbackInsert(feedbackId)
      console.log("feedbackInsertData", feedbackInsertData)
      setEditingFeedback(feedbackInsertData)
      setModalOpen(true)
    }
  }, [feedbackId, editingId])

  if (error) return <div>Error: {error.message}</div>
  if (errorFeedback) return <div>Error: {errorFeedback.message}</div>
  if (isPending) return <Loading />
  if (isSubmitting) return <Loading />

  const dataWithKey = feedbackData?.data.map(feedback => ({
    key: feedback.id, // Thêm key cho mỗi đối tượng
    id: feedback.id,
    name: feedback.name,
    star: feedback.star,
    content: feedback.content,
    show: feedback.show,
  }))

  // Onchange để thay đổi page
  const onChange: TableProps<FeedbackType>["onChange"] = (
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
    setEditingFeedback(null)
    setEditingId(null)
  }

  // SET MODAL CLOSE
  const handleModalClose = () => {
    setModalOpen(false)
    setEditingFeedback(null)
    setEditingId(null) // Reset editingId when closing modal
  }

  // Hàm mở modal và đặt feedbacks đang chỉnh sửa
  const handleEditClick = (record: FeedbackType) => {
    setEditingFeedback(null) // Clear any existing post data
    setEditingId(null) // Reset editingId first
    setTimeout(() => {
      setEditingId(record.id) // Set the editingId after resetting it
    }, 0) // Delay the setting to ensure state update
  }

  // HANDLE SUBMIT (Thêm hoặc cập nhật)
  const handleModalSubmit = (formData: FormData) => {
    setIsSubmit(true)
    if (editingFeedback && editingId !== null) {
      updateFeedback(
        { id: editingId, formData },
        {
          onSuccess: () => {
            message.success("Đánh giá đã được cập nhật thành công!")
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] })
            setModalOpen(false)
            setEditingFeedback(null) // Xóa trạng thái Đánh giá đang chỉnh sửa
            setEditingId(null) // Reset the id after update
            setIsSubmit(false)
          },
          onError: error => {
            console.error("Error updating feedback:", error)
            setIsSubmit(false)
          },
        },
      )
    } else {
      // Nếu không thì thêm mới
      insertFeedback(formData, {
        onSuccess: () => {
          message.success("Đánh giá đã được thêm thành công!")
          queryClient.invalidateQueries({ queryKey: ["feedbacks"] })
          setModalOpen(false)
          setEditingFeedback(null) // Xóa trạng thái Đánh giá đang chỉnh sửa
          setEditingId(null) // Reset the id after update
          setIsSubmit(false)
        },
        onError: error => {
          console.error("Error adding feedback:", error)
          setIsSubmit(false)
        },
      })
    }
  }

  // Function to handle delete click
  const handleDeleteClick = (id: number) => {
    Modal.confirm({
      title: "Xóa đánh giá",
      content: "Bạn có chắc chắn muốn xóa đánh giá này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        setIsDeleting(true)
        deleteFeedback(id, {
          onSuccess: () => {
            message.success("Đánh giá đã được xóa thành công!")
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] }) // Refresh the posts data
            setIsDeleting(false)
          },
          onError: error => {
            message.error("Đã xảy ra lỗi khi xóa đánh giá.")
            console.error("Error deleting post:", error)
            setIsDeleting(false)
          },
        })
      },
    })
  }

  // Column table
  const columns: TableColumnsType<FeedbackType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đánh giá",
      dataIndex: "star",
      key: "star",
      // render: (menus: string) => menus, // Đảm bảo menus hiển thị dưới dạng string
    },
    {
      title: "Show",
      dataIndex: "show",
      key: "show",
      render: (show: number) => (show ? "Yes" : "No"),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
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
        title={() => renderHeader("Danh sách đánh giá khách hàng", handleAddClick)}
        columns={columns}
        dataSource={dataWithKey}
        rowKey="id"
        onChange={onChange}
        pagination={{
          current: current_page,
          pageSize: per_page,
          total,
          // showSizeChanger: true,
        }}
      />

      <FeedbackModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        loading={isSubmit}
        key={editingId}
        initialValues={
          editingFeedback ? (editingFeedback as FeedbackInsert) : undefined
        } // Explicitly typecast if required
      />
    </>
  )
}

export default FeedbackTable
