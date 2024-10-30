import { DownOutlined } from "@ant-design/icons"
import type { MenuProps } from "antd"
import { Button, Dropdown, Space } from "antd"
import { Link } from "react-router-dom"

const items: MenuProps["items"] = [
  {
    label: <Link to={"/"}>Quản lý tài khoản</Link>,
    key: "0",
  },
  {
    label: <Link to={"/logout"}>Đăng xuất</Link>,
    key: "1",
  },
  {
    type: "divider",
  },
  // {
  //   label: "3rd menu item",
  //   key: "3",
  // },
]

const DropdownMenu: React.FC = () => (
  <Dropdown menu={{ items }} trigger={["click"]}>
    <Button onClick={e => e.preventDefault()}>
      <Space>
        Tên người dùng
        <DownOutlined />
      </Space>
    </Button>
  </Dropdown>
)

export default DropdownMenu
