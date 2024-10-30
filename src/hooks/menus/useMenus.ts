import type { UseQueryResult } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"

import { useSearchParams } from "react-router-dom"
import { getAllMenus, getMenuById, getMenus } from "../../services/api-menu"
import type {
  ChildMenuItem,
  MenuInsert,
  MenuPagination,
} from "../../types/menu"

export const useAllMenus = (): UseQueryResult<MenuPagination, Error> => {
  return useQuery<MenuPagination, Error>({
    queryKey: ["menus"],
    queryFn: () => getAllMenus(), // Chú ý đến cách gọi hàm
  })
}
export const useMenus = (): UseQueryResult<MenuPagination, Error> => {
  const [searchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get("page") || "1", 10)

  return useQuery<MenuPagination, Error>({
    queryKey: ["menus", currentPage],
    queryFn: () => getMenus(currentPage), // Chú ý đến cách gọi hàm
  })
}

export const useMenuById = (id: number): UseQueryResult<MenuInsert, Error> => {
  return useQuery<MenuInsert, Error>({
    queryKey: ["menuById", id],
    queryFn: () => getMenuById({ id }), // Chỉ gọi API nếu ID hợp lệ
  })
}
