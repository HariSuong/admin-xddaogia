import { useQueryClient } from "@tanstack/react-query"
import type { TableColumnsType, TableProps } from "antd"
import { Button, message, Modal, Table } from "antd"
import { useEffect, useState } from "react"
import { FaPencil, FaTrashCan } from "react-icons/fa6"
import { useSearchParams } from "react-router-dom"
import { useInsertUser } from "../../hooks/users/useInsertUser"
import { useUserById, useUsers } from "../../hooks/users/useUsers"

import type { InsertUserType, UserType } from "../../types/user"

import { useDeleteUser } from "../../hooks/users/useDeleteUser"
import { useUpdateUser } from "../../hooks/users/useUpdateUser"
import { convertDataUserToUserInsert } from "../../utils/lib"
import Loading from "../loading"
import { renderHeader } from "../render-header"
import UserModal from "./user-modal"
import axios from "axios"

const UserTable: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  const [editingUser, setEditingUser] = useState<
    InsertUserType | UserType | null
  >(null) // State cập nhật edit
  const [editingId, setEditingId] = useState<number | null>(null)
  // State cập nhật delete
  const [isDeleting, setIsDeleting] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams() // Để thay đổi giá trị page trong URL

  // Sử dụng QueryClient để invalidate dữ liệu
  const queryClient = useQueryClient()

  const { data: dataUser, isPending, error } = useUsers()
  const { current_page, per_page, total } = dataUser || {}
  const {
    mutate: insertUser,
    isPending: isSubmitting,
    error: errorUser,
  } = useInsertUser()

  const { data: userData, isLoading: isUserLoading } = useUserById(
    editingId as number,
  )
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(null) // State để lưu lỗi
  console.log("userData", userData)
  console.log("editingId", editingId)

  // Use the delete mutation
  const { mutate: deleteUser } = useDeleteUser()

  // Gọi updateUser khi cần cập nhật
  const { mutate: updateUser } = useUpdateUser()

  useEffect(() => {
    console.log("userData", userData)
    if (userData) {
      const userInsertData = convertDataUserToUserInsert(userData)
      console.log("userInsertData", userInsertData)
      setEditingUser({ ...userInsertData, password: "" })
      setModalOpen(true)
    }
  }, [userData, editingId])

  if (error) return <div>Error: {error.message}</div>
  if (errorUser) return <div>Error: {errorUser.message}</div>
  if (isPending) return <Loading />
  if (isSubmitting) return <Loading />

  const dataWithKey = dataUser?.data.map(user => ({
    id: user.id,
    name: user.name || user.full_name || user.username, // Chọn thuộc tính nào phù hợp
    email: user.email,
    phone: user.phone || null, // Nếu phone có thể null
    key: user.id, // Thêm key cho mỗi đối tượng
  }))

  // Onchange để thay đổi page
  const onChange: TableProps<UserType>["onChange"] = (
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
    setEditingUser(null)
  }

  // SET MODAL CLOSE
  const handleModalClose = () => {
    setModalOpen(false)
    setEditingUser(null)
    setEditingId(null) // Reset editingId when closing modal
    console.log("close modal")
  }

  // Hàm mở modal và đặt người dùng đang chỉnh sửa
  const handleEditClick = (record: UserType) => {
    console.log("record", record)
    setEditingUser(null) // Clear any existing post data
    setEditingId(null) // Reset editingId first
    setTimeout(() => {
      setEditingId(record.id) // Set the editingId after resetting it
    }, 0) // Delay the setting to ensure state update
  }

  // HANDLE SUBMIT (Thêm hoặc cập nhật)
  const handleModalSubmit = (formData: FormData) => {
    setErrors(null) // Xóa lỗi trước khi submit
    if (editingUser && editingId !== null) {
      // Nếu đang chỉnh sửa thì update
      updateUser(
        { id: editingId, formData },
        {
          onSuccess: () => {
            message.success("Người dùng đã được cập nhật!")
            queryClient.invalidateQueries({ queryKey: ["users"] })
            setModalOpen(false)
            setEditingUser(null) // Reset lại state editingPost
            setEditingId(null) // Reset lại state editingId
            setErrors(null) // Xóa lỗi sau khi cập nhật thành công
          },
          onError: error => {
            if (
              axios.isAxiosError(error) &&
              error.response &&
              error.response.data.errors
            ) {
              // Nếu error là AxiosError và có chứa lỗi cụ thể từ backend
              setErrors(error.response.data.errors)
            } else {
              message.error("Cập nhật thất bại. Lỗi: " + error.message)
            }
          },
        },
      )
    } else {
      // Nếu không thì thêm mới
      insertUser(formData, {
        onSuccess: () => {
          message.success("người dùng đã được thêm thành công!")
          queryClient.invalidateQueries({ queryKey: ["users"] })
          setModalOpen(false)
          setErrors(null) // Xóa lỗi sau khi cập nhật thành công
        },
        onError: error => {
          if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.data.errors
          ) {
            // Nếu error là AxiosError và có chứa lỗi cụ thể từ backend
            setErrors(error.response.data.errors)
          } else {
            message.error("Cập nhật thất bại. Lỗi: " + error.message)
          }
        },
      })
    }
  }

  // Function to handle delete click
  const handleDeleteClick = (id: number) => {
    console.log("delete clicked", id)

    Modal.confirm({
      title: "Xóa người dùng",
      content: "Bạn có chắc chắn muốn xóa người dùng này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        setIsDeleting(true)
        deleteUser(id, {
          onSuccess: () => {
            message.success("người dùng đã được xóa thành công!")
            queryClient.invalidateQueries({ queryKey: ["users"] }) // Refresh the posts data
            setIsDeleting(false)
          },
          onError: error => {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              message.error("Người dùng không tồn tại hoặc đã bị xóa.")
            } else {
              message.error("Đã xảy ra lỗi khi xóa người dùng.")
            }
            console.error("Error deleting user:", error)
            setIsDeleting(false)
          },
        })
      },
    })
  }

  // Column table
  const columns: TableColumnsType<UserType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên hiển thị",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
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
        title={() => renderHeader("Danh sách người dùng", handleAddClick)}
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

      <UserModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit} // Truyền hàm handleModalSubmit xuống modal
        loading={isSubmit}
        key={editingUser ? editingUser.name : "new"} // Thêm key dựa trên id của post
        initialValues={
          editingUser ? (editingUser as InsertUserType) : undefined
        } // Explicitly typecast if required
        errors={errors} // Truyền lỗi vào UserModal
      />
    </>
  )
}

export default UserTable
