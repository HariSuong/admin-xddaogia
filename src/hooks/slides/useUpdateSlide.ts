// hooks/posts/useUpdatePost.ts
import type { UseMutationResult } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { updateSlide } from "../../services/api-slide"

// Custom hook sử dụng mutation để cập nhật bài viết
export const useUpdateSlide = (): UseMutationResult<
  void,
  Error,
  { id: number; formData: FormData }
> => {
  return useMutation({
    mutationFn: ({ id, formData }) => updateSlide({ id, formData }),
  })
}
