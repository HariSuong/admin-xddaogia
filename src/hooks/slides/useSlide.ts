import type { UseQueryResult } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"

import { useSearchParams } from "react-router-dom"
import { getSlideById, getSlides } from "../../services/api-slide"
import type { Slide, SlidePagination } from "../../types/slide"

export const useSlides = (): UseQueryResult<SlidePagination, Error> => {
  const [searchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get("page") || "1", 10)

  return useQuery<SlidePagination, Error>({
    queryKey: ["slides", currentPage],
    queryFn: () => getSlides(currentPage), // Chú ý đến cách gọi hàm,
  })
}

export const useSlideById = (id: number): UseQueryResult<Slide, Error> => {
  return useQuery<Slide, Error>({
    queryKey: ["slideById", id],
    queryFn: () => getSlideById({ id }), // Chỉ gọi API nếu ID hợp lệ
  })
}
