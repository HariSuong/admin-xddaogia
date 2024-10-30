import { Breadcrumb, Layout, Menu, theme } from "antd"
import NavBar from "./navbar"
import { Outlet } from "react-router"
import DropdownMenu from "./dropdown-menu"
import { Link } from "react-router-dom"

const { Header, Content, Sider } = Layout

const items1 = ["1", "2", "3"].map(key => ({
  key,
  label: `nav ${key}`,
}))

const LayoutWeb: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const username = localStorage.getItem("username")

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <>
          {/* <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={items1}
            style={{ flex: 1, minWidth: 0 }}
          /> */}
          <div style={{ color: "white" }}>Xin chào, {username}</div>
        </>
        <Link style={{ color: "white" }} to="logout">
          Đăng xuất
        </Link>
      </Header>

      <Layout>
        <Sider
          width={250} // Tăng chiều rộng của Sider để tránh chồng lấn
          style={{ background: colorBgContainer }}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            // console.log(broken)
          }}
          onCollapse={(collapsed, type) => {
            // console.log(collapsed, type)
          }}
        >
          <NavBar /> {/* Sử dụng NavBar đã tạo làm menu bên Sider */}
        </Sider>
        <Layout style={{ padding: "0 24px 24px", marginLeft: 12 }}>
          {/* marginLeft để tránh chồng lấn với Sider */}
          {/* <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> */}
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default LayoutWeb
