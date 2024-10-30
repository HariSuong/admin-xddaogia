import { useQuery } from "@tanstack/react-query"
import type { UseQueryResult } from "@tanstack/react-query"

import type { User, UserPagination } from "../../types/user"
import { getUserById, getUsers } from "../../services/api"
import { useSearchParams } from "react-router-dom"

export const useUsers = (): UseQueryResult<UserPagination, Error> => {
  const [searchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get("page") || "1", 10)

  return useQuery<UserPagination, Error>({
    queryKey: ["users", currentPage],
    queryFn: () => getUsers(currentPage), // Chú ý đến cách gọi hàm
  })
}

export const useUserById = (id: number): UseQueryResult<User, Error> => {
  return useQuery<User, Error>({
    queryKey: ["userById", id],
    queryFn: () => getUserById({ id }), // Chỉ gọi API nếu ID hợp lệ
  })
}
