// usePosts.ts
import type { UseMutationResult } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { insertPost } from "../../services/api-post"

// Custom hook sử dụng mutation để gọi API chèn bài viết
export const useInsertPost = (): UseMutationResult<void, Error, FormData> => {
  return useMutation({
    mutationFn: (postData: FormData) => insertPost(postData),
  })
}
