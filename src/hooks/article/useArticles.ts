import type { UseQueryResult } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"

import { useSearchParams } from "react-router-dom"
import { getArticles } from "../../services/api-article"
import type { ArticlePagination } from "../../types/article"

export const useArticles = (): UseQueryResult<ArticlePagination, Error> => {
  const [searchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get("page") || "1", 10)

  return useQuery<ArticlePagination, Error>({
    queryKey: ["articles", currentPage],
    queryFn: () => getArticles(currentPage), // Chú ý đến cách gọi hàm,
  })
}
