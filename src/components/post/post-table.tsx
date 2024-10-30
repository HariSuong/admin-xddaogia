import { Table, Button, message, Modal } from "antd"
import type { TableColumnsType, TableProps } from "antd"
import { FaPencil, FaTrashCan } from "react-icons/fa6"
import { renderHeader } from "../render-header"
import { useEffect, useState } from "react"
import PostModal from "./post-modal"
import type { Post, PostInsert, PostType } from "../../types/post"
import { usePostById, usePosts } from "../../hooks/posts/usePosts"
import Loading from "../loading"
import { useInsertPost } from "../../hooks/posts/useInserPost"
import { useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { useUpdatePost } from "../../hooks/posts/useUpdatePost"
import { convertDataPostToPostInsert } from "../../utils/lib"
import { useDeletePost } from "../../hooks/posts/useDeletePost"
import { findCategoryNameById } from "../../utils/findCatById"

const PostTable: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  const [editingPost, setEditingPost] = useState<PostInsert | PostType | null>(
    null,
  ) // State cập nhật edit
  const [editingId, setEditingId] = useState<number | null>(null)
  // State cập nhật delete
  const [isDeleting, setIsDeleting] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams() // Để thay đổi giá trị page trong URL

  // Sử dụng QueryClient để invalidate dữ liệu
  const queryClient = useQueryClient()

  const { data: dataPost, isPending, error } = usePosts()
  const { current_page, per_page, total } = dataPost || {}
  const {
    mutate: insertPost,
    isPending: isSubmitting,
    error: errorPost,
  } = useInsertPost()

  const { data: postData, isLoading: isPostLoading } = usePostById(
    editingId as number,
  )

  // Use the delete mutation
  const { mutate: deletePost } = useDeletePost()

  // Gọi updatePost khi cần cập nhật
  const { mutate: updatePost } = useUpdatePost()

  useEffect(() => {
    // console.log("postData", postData)
    if (postData) {
      const postInsertData = convertDataPostToPostInsert(postData)
      console.log("postInsertData", postInsertData)
      setEditingPost(postInsertData)
      setModalOpen(true)
    }
  }, [postData, editingId])

  if (error) return <div>Error: {error.message}</div>
  if (errorPost) return <div>Error: {errorPost.message}</div>
  if (isPending) return <Loading />
  if (isSubmitting) return <Loading />

  const dataWithKey = dataPost?.data.map(post => ({
    key: post.id, // Thêm key cho mỗi đối tượng
    id: post.id,
    title: post.title,
    menus: post.menus,
    show: post.show,
    hot: post.hot,
  }))

  // Onchange để thay đổi page
  const onChange: TableProps<PostType>["onChange"] = (
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
    console.log("open modal")
    setModalOpen(true)
    setEditingPost(null)
    setEditingId(null)
  }

  // SET MODAL CLOSE
  const handleModalClose = () => {
    setModalOpen(false)
    setEditingPost(null)
    setEditingId(null) // Reset editingId when closing modal
    console.log("close modal")
  }

  // Hàm mở modal và đặt bài viết đang chỉnh sửa
  const handleEditClick = (record: PostType) => {
    console.log("record", record)
    setEditingPost(null) // Clear any existing post data
    setEditingId(null) // Reset editingId first
    setTimeout(() => {
      setEditingId(record.id) // Set the editingId after resetting it
    }, 0) // Delay the setting to ensure state update
  }

  // HANDLE SUBMIT (Thêm hoặc cập nhật)
  const handleModalSubmit = (formData: FormData) => {
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`)
    // }

    if (editingPost && editingId !== null) {
      // Nếu đang chỉnh sửa thì update
      updatePost(
        { id: editingId, formData },
        {
          onSuccess: () => {
            message.success("Bài viết đã được cập nhật!")
            queryClient.invalidateQueries({ queryKey: ["posts"] })
            setModalOpen(false)
            setEditingPost(null) // Reset lại state editingPost
            setEditingId(null) // Reset lại state editingId
          },
          onError: error => {
            message.error("Cập nhật thất bại. Lỗi: " + error.message)
          },
        },
      )
    } else {
      // Nếu không thì thêm mới
      insertPost(formData, {
        onSuccess: () => {
          message.success("Bài viết đã được thêm thành công!")
          queryClient.invalidateQueries({ queryKey: ["posts"] })
          setModalOpen(false)
          setEditingPost(null) // Reset lại state editingPost
          setEditingId(null) // Reset lại state editingId
        },
        onError: error => {
          message.error("Thêm mới thất bại. Lỗi: " + error.message)
        },
      })
    }
  }

  // Function to handle delete click
  const handleDeleteClick = (id: number) => {
    Modal.confirm({
      title: "Xóa bài viết",
      content: "Bạn có chắc chắn muốn xóa bài viết này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        setIsDeleting(true)
        deletePost(id, {
          onSuccess: () => {
            message.success("Bài viết đã được xóa thành công!")
            queryClient.invalidateQueries({ queryKey: ["posts"] }) // Refresh the posts data
            setIsDeleting(false)
          },
          onError: error => {
            message.error("Đã xảy ra lỗi khi xóa bài viết.")
            console.error("Error deleting post:", error)
            setIsDeleting(false)
          },
        })
      },
    })
  }

  // Column table
  const columns: TableColumnsType<PostType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Chuyên mục",
      dataIndex: "menus",
      key: "menus",
      render: (menus: number) => findCategoryNameById(menus), // Hiển thị tên chuyên mục thay vì ID
    },
    {
      title: "Show",
      dataIndex: "show",
      key: "show",
      render: (show: number) => (show ? "Yes" : "No"),
    },
    {
      title: "Hot",
      dataIndex: "hot",
      key: "hot",
      render: (hot: number) => (hot ? "Yes" : "No"),
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
        title={() => renderHeader("Danh sách bài viết", handleAddClick)}
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

      <PostModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit} // Truyền hàm handleModalSubmit xuống modal
        loading={isSubmit}
        // key={editingPost ? editingPost.title : "new"} // Thêm key dựa trên id của post
        key={editingId}
        initialValues={editingPost ? (editingPost as PostInsert) : undefined} // Explicitly typecast if required
      />
    </>
  )
}

export default PostTable
