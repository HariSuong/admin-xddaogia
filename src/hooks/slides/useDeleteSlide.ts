// useDeletePost.ts
import { useMutation } from "@tanstack/react-query"
import { deleteSlide } from "../../services/api-slide"

// Custom hook to delete a post
export const useDeleteSlide = () => {
  return useMutation({
    mutationFn: (id: number) => deleteSlide(id),
  })
}
