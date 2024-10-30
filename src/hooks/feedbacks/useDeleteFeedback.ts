// useDeletePost.ts
import { useMutation } from "@tanstack/react-query"
import { deleteFeedback } from "../../services/api-feedback"

// Custom hook to delete a post
export const useDeleteFeedback = () => {
  return useMutation({
    mutationFn: (id: number) => deleteFeedback(id),
  })
}
