// usePosts.ts
import type { UseMutationResult } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { insertFeedback } from "../../services/api-feedback"

// Custom hook sử dụng mutation để gọi API chèn bài viết
export const useInsertFeedbacks = (): UseMutationResult<
  void,
  Error,
  FormData
> => {
  return useMutation({
    mutationFn: (feedbacksData: FormData) => insertFeedback(feedbacksData),
  })
}
