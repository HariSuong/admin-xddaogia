// useDeletePost.ts
import { useMutation } from "@tanstack/react-query"
import { deleteArticles } from "../../services/api-article"

// Custom hook to delete a post
export const useDeleteArticle = () => {
  return useMutation({
    mutationFn: (id: number) => deleteArticles(id),
  })
}
