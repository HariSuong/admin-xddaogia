// usePosts.ts
import type { UseMutationResult } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { insertArticle } from "../../services/api-article"

// Custom hook sử dụng mutation để gọi API chèn bài viết
export const useInsertArticle = (): UseMutationResult<
  void,
  Error,
  FormData
> => {
  return useMutation({
    mutationFn: (feedbacksData: FormData) => insertArticle(feedbacksData),
  })
}
