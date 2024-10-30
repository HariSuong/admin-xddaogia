// useDeletePost.ts
import { useMutation } from "@tanstack/react-query"
import { deletePost } from "../../services/api-post"

// Custom hook to delete a post
export const useDeletePost = () => {
  return useMutation({
    mutationFn: (id: number) => deletePost(id),
  })
}
