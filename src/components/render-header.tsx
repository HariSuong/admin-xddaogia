import { Button } from "antd"
import { FaPlus } from "react-icons/fa6"

export const renderHeader = (title: string, onAddClick: () => void) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h3>{title}</h3>
      <>
        <Button type="primary" icon={<FaPlus />} onClick={onAddClick}>
          Thêm mới
        </Button>
      </>
    </div>
  )
}
