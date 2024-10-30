import { useQueryClient } from "@tanstack/react-query"
import type { TableColumnsType, TableProps } from "antd"
import { Button, message, Modal, Table } from "antd"
import { useEffect, useState } from "react"
import { FaPencil, FaTrashCan } from "react-icons/fa6"
import { useSearchParams } from "react-router-dom"
import { useDeleteMenu } from "../../hooks/menus/useDeleteMenu"
import { useInsertMenu } from "../../hooks/menus/useInserMenu"
import { useMenuById, useMenus } from "../../hooks/menus/useMenus"
import { useUpdateMenu } from "../../hooks/menus/useUpdateMenu"
import type { MenuInsert, MenuType } from "../../types/menu"
import type { PostInsert, PostType } from "../../types/post"
import { convertDataMenuToMenuInsert } from "../../utils/lib"
import Loading from "../loading"
import { renderHeader } from "../render-header"
import PostModal from "./menu-modal"
import { findCategoryNameById } from "../../utils/findCatById"

const MenuTable: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  const [editingPost, setEditingPost] = useState<MenuInsert | MenuType | null>(
    null,
  ) // State cập nhật edit
  const [editingId, setEditingId] = useState<number | null>(null)
  // State cập nhật delete
  const [isDeleting, setIsDeleting] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams() // Để thay đổi giá trị page trong URL

  // Sử dụng QueryClient để invalidate dữ liệu
  const queryClient = useQueryClient()

  const { data: dataMenu, isPending, error } = useMenus()
  const { current_page, per_page, total } = dataMenu || {}
  const {
    mutate: insertMenu,
    isPending: isSubmitting,
    error: errorMenu,
  } = useInsertMenu()

  const { data: menuData, isLoading: isMenuLoading } = useMenuById(
    editingId as number,
  )

  console.log("menuData", menuData)

  // Use the delete mutation
  const { mutate: deleteMenu } = useDeleteMenu()

  // Gọi updateMenu khi cần cập nhật
  const { mutate: updateMenu } = useUpdateMenu()
  useEffect(() => {
    // console.log("postData", postData)
    if (menuData) {
      const postInsertData = convertDataMenuToMenuInsert(menuData)
      setEditingPost(postInsertData)
      setModalOpen(true)
    }
  }, [menuData, editingId])

  if (error) return <div>Error: {error.message}</div>
  if (errorMenu) return <div>Error: {errorMenu.message}</div>
  if (isPending) return <Loading />
  if (isSubmitting) return <Loading />

  const dataWithKey = dataMenu?.data.map(menu => ({
    key: menu.id, // Thêm key cho mỗi đối tượng
    id: menu.id,
    name: menu.name,
    inside: menu.inside,
  }))

  // Onchange để thay đổi page
  const onChange: TableProps<MenuType>["onChange"] = (
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
  }

  // SET MODAL CLOSE
  const handleModalClose = () => {
    setModalOpen(false)
    setEditingPost(null)
    setEditingId(null) // Reset editingId when closing modal
    console.log("close modal")
  }

  // Hàm mở modal và đặt bài viết đang chỉnh sửa
  const handleEditClick = (record: MenuType) => {
    setEditingPost(null) // Clear any existing post data
    setEditingId(null) // Reset editingId first
    setTimeout(() => {
      setEditingId(record.id) // Set the editingId after resetting it
    }, 0) // Delay the setting to ensure state update
  }

  // HANDLE SUBMIT (Thêm hoặc cập nhật)
  const handleModalSubmit = (formData: FormData) => {
    // Kiểm tra nếu đang chỉnh sửa, gọi update
    if (editingPost && editingId !== null) {
      updateMenu(
        { id: editingId, formData },
        {
          onSuccess: () => {
            message.success("Chuyên mục đã được cập nhật!")
            queryClient.invalidateQueries({ queryKey: ["menus"] })
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
      insertMenu(formData, {
        onSuccess: () => {
          message.success("Chuyên mục đã được thêm thành công!")
          queryClient.invalidateQueries({ queryKey: ["posts"] })
          setModalOpen(false)
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
      title: "Xóa chuyên mục",
      content: "Bạn có chắc chắn muốn xóa chuyên mục này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        setIsDeleting(true)
        deleteMenu(id, {
          onSuccess: () => {
            message.success("Chuyên mục đã được xóa thành công!")
            queryClient.invalidateQueries({ queryKey: ["menus"] }) // Refresh the posts data
            setIsDeleting(false)
          },
          onError: error => {
            message.error("Đã xảy ra lỗi khi xóa chuyên mục.")
            console.error("Error deleting post:", error)
            setIsDeleting(false)
          },
        })
      },
    })
  }

  // Column table
  const columns: TableColumnsType<MenuType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tiêu đề",
      dataIndex: "name",
      key: "title",
    },
    {
      title: "Chuyên mục",
      dataIndex: "inside",
      key: "inside",
      render: (inside: number) => findCategoryNameById(inside), // Hiển thị tên chuyên mục thay vì ID
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
        title={() => renderHeader("Danh sách chuyên mục", handleAddClick)}
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

      <PostModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        loading={isSubmit}
        initialValues={editingPost ? (editingPost as MenuInsert) : undefined} // Explicitly typecast if required
      />
    </>
  )
}

export default MenuTable
