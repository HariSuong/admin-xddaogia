// usePosts.ts
import type { UseMutationResult } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { insertSlide } from "../../services/api-slide"

// Custom hook sử dụng mutation để gọi API chèn bài viết
export const useInsertSlide = (): UseMutationResult<void, Error, FormData> => {
  return useMutation({
    mutationFn: (feedbacksData: FormData) => insertSlide(feedbacksData),
  })
}
