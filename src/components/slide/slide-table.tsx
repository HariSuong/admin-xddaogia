import type { TableColumnsType, TableProps } from "antd"
import { Button, message, Modal, Table } from "antd"
import { useEffect, useState } from "react"
import { FaPencil, FaTrashCan } from "react-icons/fa6"
import { renderHeader } from "../render-header"

import { useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { useDeleteFeedback } from "../../hooks/feedbacks/useDeleteFeedback"
import { useFeedbacks } from "../../hooks/feedbacks/useFeedbacks"
import { useInsertFeedbacks } from "../../hooks/feedbacks/useInsertFeedback"
import { useUpdateFeedback } from "../../hooks/feedbacks/useUpdateFeedback"
import type { FeedbackInsert, FeedbackType } from "../../types/feedback"
import {
  convertDataFeedbackToFeedbackInsert,
  convertDataSlideToSlideInsert,
} from "../../utils/lib"
import Loading from "../loading"
// import FeedbackModal from "./feedback-modal"
import { useSlideById, useSlides } from "../../hooks/slides/useSlide"
import type { SlideInsert, SlideType } from "../../types/slide"
import { useInsertSlide } from "../../hooks/slides/useInsertSlide"
import SlideModal from "./slide-modal"
import { useUpdateSlide } from "../../hooks/slides/useUpdateSlide"
import { useDeleteSlide } from "../../hooks/slides/useDeleteSlide"

const SlideTable: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  const [editingFeedback, setEditingSlide] = useState<
    SlideInsert | SlideType | null
  >(null) // State cập nhật edit
  const [editingId, setEditingId] = useState<number | null>(null)
  // State cập nhật delete
  const [isDeleting, setIsDeleting] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams() // Để thay đổi giá trị page trong URL

  // Sử dụng QueryClient để invalidate dữ liệu
  const queryClient = useQueryClient()

  const { data: slidesData, isPending, error } = useSlides()
  const { current_page, per_page, total } = slidesData || {}

  const {
    mutate: insertSlide,
    isPending: isSubmitting,
    error: errorSlide,
  } = useInsertSlide()

  const { data: slideId } = useSlideById(editingId as number)

  // Use the delete mutation
  const { mutate: deleteSlide } = useDeleteSlide()

  // Gọi updatePost khi cần cập nhật
  const { mutate: updateSlide } = useUpdateSlide()

  useEffect(() => {
    // console.log("postData", postData)
    if (slideId) {
      const SlideInsertDatSlide = convertDataSlideToSlideInsert(slideId)
      setEditingSlide(SlideInsertDatSlide)

      setModalOpen(true)
    }
  }, [slideId, editingId])

  if (error) return <div>Error: {error.message}</div>
  if (errorSlide) return <div>Error: {errorSlide.message}</div>
  if (isPending) return <Loading />
  if (isSubmitting) return <Loading />

  const dataWithKey = slidesData?.data.map(slide => ({
    key: slide.id, // Thêm key cho mỗi đối tượng
    id: slide.id,
    title: slide.title,
    desc: slide.desc,
    show: slide.show,
  }))

  // Onchange để thay đổi page
  const onChange: TableProps<SlideType>["onChange"] = (
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
    setEditingSlide(null)
    setEditingId(null)
  }

  // SET MODAL CLOSE
  const handleModalClose = () => {
    setModalOpen(false)
    setEditingSlide(null)
    setEditingId(null)
  }

  // Hàm mở modal và đặt feedbacks đang chỉnh sửa
  const handleEditClick = (record: SlideType) => {
    setEditingSlide(null)
    setEditingId(null) // Reset editingId first
    setTimeout(() => {
      setEditingId(record.id) // Set the editingId after resetting it
    }, 0) // Delay the setting to ensure state update
  }

  // HANDLE SUBMIT (Thêm hoặc cập nhật)
  const handleModalSubmit = (formData: FormData) => {
    setIsSubmit(true)
    if (editingFeedback && editingId !== null) {
      updateSlide(
        { id: editingId, formData },
        {
          onSuccess: () => {
            message.success("Slide đã được cập nhật thành công!")
            queryClient.invalidateQueries({ queryKey: ["slides"] })
            setModalOpen(false)
            setEditingSlide(null) // Xóa trạng thái Slide đang chỉnh sửa
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
      insertSlide(formData, {
        onSuccess: () => {
          message.success("Slide đã được thêm thành công!")
          queryClient.invalidateQueries({ queryKey: ["slides"] })
          setModalOpen(false)
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
      title: "Xóa Slide",
      content: "Bạn có chắc chắn muốn xóa Slide này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        setIsDeleting(true)
        deleteSlide(id, {
          onSuccess: () => {
            message.success("Slide đã được xóa thành công!")
            queryClient.invalidateQueries({ queryKey: ["slides"] }) // Refresh the posts data
            setIsDeleting(false)
          },
          onError: error => {
            message.error("Đã xảy ra lỗi khi xóa Slide.")
            console.error("Error deleting post:", error)
            setIsDeleting(false)
          },
        })
      },
    })
  }

  // Column table
  const columns: TableColumnsType<SlideType> = [
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
        title={() => renderHeader("Danh sách slides", handleAddClick)}
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
        key={editingId}
        initialValues={
          editingFeedback ? (editingFeedback as SlideInsert) : undefined
        } // Explicitly typecast if required
      />
    </>
  )
}

export default SlideTable
