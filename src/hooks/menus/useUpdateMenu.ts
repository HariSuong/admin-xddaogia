// hooks/posts/useUpdatePost.ts
import type { UseMutationResult } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { updateMenu } from "../../services/api-menu"

// Custom hook sử dụng mutation để cập nhật bài viết
export const useUpdateMenu = (): UseMutationResult<
  void,
  Error,
  { id: number; formData: FormData }
> => {
  return useMutation({
    mutationFn: ({ id, formData }) => updateMenu({ id, formData }),
  })
}
