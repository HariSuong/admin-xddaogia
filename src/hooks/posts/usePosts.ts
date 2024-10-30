import type { UseQueryResult } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"

import { useSearchParams } from "react-router-dom"
import { getPostById, getPosts } from "../../services/api-post"
import type { Post, PostPagination } from "../../types/post"

export const usePosts = (): UseQueryResult<PostPagination, Error> => {
  const [searchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get("page") || "1", 10)

  return useQuery<PostPagination, Error>({
    queryKey: ["posts", currentPage],
    queryFn: () => getPosts(currentPage), // Chú ý đến cách gọi hàm
  })
}

export const usePostById = (id: number): UseQueryResult<Post, Error> => {
  return useQuery<Post, Error>({
    queryKey: ["postById", id],
    queryFn: () => getPostById({ id }), // Chỉ gọi API nếu ID hợp lệ
  })
}
