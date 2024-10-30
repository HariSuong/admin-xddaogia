import { Menu } from "antd"
import type { MenuProps } from "antd"
import {
  FaFileAlt,
  FaRegImage,
  FaUser,
  FaRegCommentDots,
  FaSlidersH,
  FaFileContract,
  FaFolder,
} from "react-icons/fa"
import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

type MenuItem = Required<MenuProps>["items"][number]

const items: MenuItem[] = [
  {
    key: "posts",
    label: <Link to="/posts"> Bài viết</Link>,
    icon: <FaFileAlt />,
  },
  {
    key: "cats",
    label: <Link to="/cats">Chuyên mục</Link>,
    icon: <FaFolder />,
  },
  {
    key: "users",
    label: <Link to="/users">Người dùng</Link>,
    icon: <FaUser />,
  },
  {
    key: "feedbacks",
    label: <Link to="/feedbacks">Đánh giá khách hàng</Link>,
    icon: <FaRegCommentDots />,
  },
  {
    key: "articles",
    label: <Link to="/articles">Chính sách</Link>,
    icon: <FaFileContract />,
  },
  {
    key: "sliders",
    label: <Link to="/sliders">Slider</Link>,
    icon: <FaSlidersH />,
  },
]

const NavBar: React.FC = () => {
  const location = useLocation()
  const [selectedKey, setSelectedKey] = useState<string>("posts")

  // Cập nhật selectedKey khi URL thay đổi
  useEffect(() => {
    const currentPath = location.pathname.split("/")[1] || "posts"
    setSelectedKey(currentPath)
  }, [location.pathname])

  const onClick: MenuProps["onClick"] = e => {
    setSelectedKey(e.key)
  }

  return (
    <Menu
      onClick={onClick}
      style={{ width: 256 }}
      selectedKeys={[selectedKey]}
      mode="inline"
      items={items}
    />
  )
}

export default NavBar
