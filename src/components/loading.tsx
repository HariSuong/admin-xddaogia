import type React from "react"
import { Alert, Flex, Spin } from "antd"

const contentStyle: React.CSSProperties = {
  padding: 50,
  background: "rgba(0, 0, 0, 0.05)",
  borderRadius: 4,
}

const content = <div style={contentStyle} />

const Loading: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh", // Căn giữa dọc toàn bộ màn hình
    }}
  >
    <Spin
      tip="Loading"
      size="large"
      style={{
        transform: "scale(1.5)", // Tăng kích thước của Spin
      }}
    >
      <div
        style={{
          padding: "80px", // Tăng kích thước của hộp loading
          background: "rgba(0, 0, 0, 0.05)",
          borderRadius: "8px", // Làm bo góc
        }}
      />
    </Spin>
  </div>
)

export default Loading
