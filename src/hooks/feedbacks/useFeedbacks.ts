import type { UseQueryResult } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"

import { useSearchParams } from "react-router-dom"
import { getFeedbackById, getFeedbacks } from "../../services/api-feedback"
import type { Feedback, FeedbackPagination } from "../../types/feedback"

export const useFeedbacks = (): UseQueryResult<FeedbackPagination, Error> => {
  const [searchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get("page") || "1", 10)

  return useQuery<FeedbackPagination, Error>({
    queryKey: ["feedbacks", currentPage],
    queryFn: () => getFeedbacks(currentPage), // Chú ý đến cách gọi hàm,
  })
}

export const useFeedbackById = (
  id: number,
): UseQueryResult<Feedback, Error> => {
  return useQuery<Feedback, Error>({
    queryKey: ["feedbackById", id],
    queryFn: () => getFeedbackById({ id }), // Chỉ gọi API nếu ID hợp lệ
  })
}
