// hooks/posts/useUpdatePost.ts
import { useMutation } from "@tanstack/react-query"
import type { UseMutationResult } from "@tanstack/react-query"
import { updatePost } from "../../services/api-post"

// Custom hook sử dụng mutation để cập nhật bài viết
export const useUpdatePost = (): UseMutationResult<
  void,
  Error,
  { id: number; formData: FormData }
> => {
  return useMutation({
    mutationFn: ({ id, formData }) => updatePost({ id, formData }),
  })
}
