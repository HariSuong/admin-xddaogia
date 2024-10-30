// hooks/posts/useUpdatePost.ts
import type { UseMutationResult } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { updateArticle } from "../../services/api-article"

// Custom hook sử dụng mutation để cập nhật bài viết
export const useUpdateArticle = (): UseMutationResult<
  void,
  Error,
  { id: number; formData: FormData }
> => {
  return useMutation({
    mutationFn: ({ id, formData }) => updateArticle({ id, formData }),
  })
}
